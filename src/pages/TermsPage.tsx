import './TermsPage.css'

const EFFECTIVE_DATE = 'June 26, 2026'
const CONTACT_EMAIL = 'rorater81@gmail.com'

function TermsPage() {
  return (
    <article className="terms">
      <h1>Terms of Service</h1>
      <p className="terms-effective">Last updated {EFFECTIVE_DATE}</p>

      <p className="terms-intro">
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of RoRater (the &ldquo;Service&rdquo;). By logging in or otherwise
        using the Service, you agree to these Terms. If you do not agree, do not
        use the Service.
      </p>

      <section className="terms-section">
        <h2>1. Not affiliated with Roblox</h2>
        <p>
          RoRater is an independent, fan-made project. It is not created by,
          endorsed by, sponsored by, or affiliated with Roblox Corporation in
          any way. &ldquo;Roblox&rdquo; and all related names, marks, avatars,
          artwork, and logos are the property of Roblox Corporation. We claim no
          ownership of any Roblox intellectual property.
        </p>
      </section>

      <section className="terms-section">
        <h2>2. The Service</h2>
        <p>
          RoRater lets signed-in users look up publicly available Roblox
          account information &mdash; such as usernames, display names, and
          avatars retrieved through Roblox&rsquo;s public APIs &mdash; and
          submit subjective ratings of avatars. We display this information only
          to provide the Service to you and do not sell it, redistribute it in
          bulk, or use it to train AI or machine-learning models.
        </p>
        <p>
          You may use RoRater only for your own personal, non-commercial
          enjoyment. You may not reproduce, scrape, resell, or build a competing
          product from the data the Service displays.
        </p>
      </section>

      <section className="terms-section">
        <h2>3. Compliance with Roblox&rsquo;s Terms of Use</h2>
        <p>
          Your use of any Roblox account, content, or data through RoRater
          remains subject to{' '}
          <a
            href="https://en.help.roblox.com/hc/en-us/articles/115004647846-Roblox-Terms-of-Use"
            target="_blank"
            rel="noreferrer noopener"
          >
            Roblox&rsquo;s Terms of Use
          </a>
          , Community Standards, and related policies. You agree not to use
          RoRater in any way that would cause you, or us, to violate those
          policies. In particular, you agree not to use the Service to harass,
          demean, target, dox, or single out any Roblox user, including through
          the ratings you submit.
        </p>
      </section>

      <section className="terms-section">
        <h2>4. Ratings are opinions</h2>
        <p>
          Ratings and leaderboard positions reflect the subjective opinions of
          RoRater users about avatars. They are not facts, not endorsed by us,
          and not a judgment of any person. Do not treat them as anything more
          than that. We may remove ratings, leaderboard entries, or accounts
          that are abusive or that violate these Terms.
        </p>
      </section>

      <section className="terms-section">
        <h2>5. Accounts and authentication</h2>
        <p>
          You sign in to RoRater using your Roblox account through
          Roblox&rsquo;s official login. You are responsible for activity that
          occurs under your account. We only receive the basic profile
          information that Roblox shares during login, and we use it solely to
          operate the Service.
        </p>
      </section>

      <section className="terms-section">
        <h2>6. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>
            use the Service to harass, threaten, or harm any person, including
            minors;
          </li>
          <li>
            scrape, crawl, or programmatically access the Service or its
            underlying data;
          </li>
          <li>
            attempt to identify, track, profile, or build a dossier on any
            individual;
          </li>
          <li>
            sell, license, or commercially exploit any data obtained through the
            Service; or
          </li>
          <li>
            interfere with, disrupt, or attempt to gain unauthorized access to
            the Service or Roblox&rsquo;s systems.
          </li>
        </ul>
      </section>

      <section className="terms-section">
        <h2>7. Removal and opt-out requests</h2>
        <p>
          If you are a Roblox user and want your account excluded from RoRater,
          or you believe content infringes your rights, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will
          remove the relevant data. If Roblox revokes our access to its APIs for
          any reason, we will stop using and delete the affected data.
        </p>
      </section>

      <section className="terms-section">
        <h2>8. Disclaimer and limitation of liability</h2>
        <p>
          The Service is provided &ldquo;as is&rdquo; and &ldquo;as
          available,&rdquo; without warranties of any kind. To the fullest
          extent permitted by law, RoRater and its operators are not liable for
          any indirect, incidental, or consequential damages arising from your
          use of the Service.
        </p>
      </section>

      <section className="terms-section">
        <h2>9. Changes and termination</h2>
        <p>
          We may modify these Terms or the Service at any time. Continued use
          after a change means you accept the updated Terms. We may suspend or
          terminate access to the Service, in whole or in part, at any time.
        </p>
      </section>

      <section className="terms-section">
        <h2>10. Contact</h2>
        <p>
          Questions about these Terms? Email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </article>
  )
}

export default TermsPage
