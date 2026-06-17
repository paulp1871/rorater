import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import './Avatar3DViewer.css'

type Status = 'loading' | 'done' | 'error'

interface Vec3 {
  x: number
  y: number
  z: number
}

// The JSON manifest that a Roblox avatar-3d / asset-3d thumbnail URL returns.
interface Manifest {
  obj: string
  mtl: string
  textures: string[]
  camera: { position: Vec3; direction: Vec3; fov: number }
  aabb: { min: Vec3; max: Vec3 }
}

// Roblox spreads CDN files across t0-t7.rbxcdn.com; the hash itself encodes which
// server holds it, via an XOR over its characters. See the Roblox devforum guide.
function hashToUrl(hash: string): string {
  let i = 31
  for (let t = 0; t < hash.length; t++) i ^= hash.charCodeAt(t)
  return `https://t${i % 8}.rbxcdn.com/${hash}`
}

interface Props {
  manifestUrl: string
}

function Avatar3DViewer({ manifestUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let disposed = false
    let frame = 0
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    let controls: OrbitControls | null = null

    const width = container.clientWidth || 320
    const height = container.clientHeight || 360
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000)
    scene.add(new THREE.AmbientLight(0xffffff, 1.4))
    const dir = new THREE.DirectionalLight(0xffffff, 1.2)
    dir.position.set(1, 1, 1)
    scene.add(dir)

    async function load() {
      const manifest = (await fetchJson(manifestUrl)) as Manifest

      // The MTL references its textures by bare hash; rewrite each to the correct
      // CDN URL so the TextureLoader can fetch them.
      const mtlText = await fetchText(hashToUrl(manifest.mtl))
      const rewrittenMtl = mtlText.replace(
        /^(map_\w+\s+)(\S+)/gm,
        (_, prefix: string, file: string) => prefix + hashToUrl(file),
      )

      const materials = new MTLLoader().parse(rewrittenMtl, '')
      materials.preload()

      const objText = await fetchText(hashToUrl(manifest.obj))
      const model = new OBJLoader().setMaterials(materials).parse(objText)

      if (disposed) {
        disposeModel(model)
        return
      }

      // Roblox's exported alpha maps cause unwanted transparency; force it off.
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mats = Array.isArray(child.material)
            ? child.material
            : [child.material]
          mats.forEach((m: THREE.Material) => {
            m.transparent = false
            m.side = THREE.DoubleSide
          })
        }
      })
      scene.add(model)

      // Frame using the manifest camera, orbiting around the model's center.
      const center = new THREE.Vector3(
        (manifest.aabb.min.x + manifest.aabb.max.x) / 2,
        (manifest.aabb.min.y + manifest.aabb.max.y) / 2,
        (manifest.aabb.min.z + manifest.aabb.max.z) / 2,
      )
      camera.fov = manifest.camera.fov
      camera.position.set(
        manifest.camera.position.x,
        manifest.camera.position.y,
        manifest.camera.position.z,
      )
      camera.updateProjectionMatrix()

      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.target.copy(center)
      controls.update()

      setStatus('done')

      const animate = () => {
        frame = requestAnimationFrame(animate)
        controls?.update()
        renderer.render(scene, camera)
      }
      animate()
    }

    load().catch((err) => {
      console.error('Failed to render 3D avatar', err)
      if (!disposed) setStatus('error')
    })

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      controls?.dispose()
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) disposeModel(child)
      })
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
    }
  }, [manifestUrl])

  return (
    <div className="viewer-3d">
      <div ref={containerRef} className="viewer-3d-canvas" />
      {status === 'loading' && (
        <p className="viewer-3d-status">Loading 3D avatar…</p>
      )}
      {status === 'error' && (
        <p className="viewer-3d-status error">Could not load 3D avatar.</p>
      )}
    </div>
  )
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`)
  return res.json()
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`)
  return res.text()
}

function disposeModel(root: THREE.Object3D) {
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose()
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m: THREE.Material) => {
        const map = (m as THREE.MeshPhongMaterial).map
        map?.dispose()
        m.dispose()
      })
    }
  })
}

export default Avatar3DViewer
