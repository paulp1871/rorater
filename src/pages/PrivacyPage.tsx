import './PrivacyPage.css'

const EFFECTIVE_DATE = 'June 26, 2026'
const CONTACT_EMAIL = 'rorater81@gmail.com'

const POLICY_URL =
  'https://en.help.roblox.com/hc/en-us/articles/37924211313044-Creator-Third-Party-App-Policy'

function PrivacyPage() {
  return (
    <article className="privacy">
      <h1>Privacy Policy</h1>
      <p className="privacy-effective">Last updated {EFFECTIVE_DATE}</p>

      <p className="privacy-intro">
        This Privacy Policy explains what information RoRater (the
        &ldquo;Service&rdquo;) collects, how we use it, and the choices you
        have. RoRater authenticates with Roblox through OAuth 2.0, and we handle
        Roblox data in line with Roblox&rsquo;s{' '}
        <a href={POLICY_URL} target="_blank" rel="noreferrer noopener">
          Creator Third Party App Policy
        </a>
        . By using the Service, you consent to the practices described here.
      </p>

      <section className="privacy-section">
        <h2>1. Not affiliated with Roblox</h2>
        <p>
          RoRater is an independent, fan-made project and is not created by,
          endorsed by, sponsored by, or affiliated with Roblox Corporation. Your
          Roblox account and any Roblox data remain governed by Roblox&rsquo;s
          own Terms of Use and Privacy Policy.
        </p>
      </section>

      <section className="privacy-section">
        <h2>2. Information we collect</h2>
        <p>We collect only what we need to run the Service:</p>
        <ul>
          <li>
            <strong>Roblox login data.</strong> When you sign in with Roblox
            OAuth 2.0, Roblox shares a basic profile: your user ID, username,
            display name, and avatar image. We request the minimum scopes
            necessary and nothing more.
          </li>
          <li>
            <strong>Ratings you submit.</strong> The scores you give and the
            Roblox user IDs they apply to, so we can show your ratings back to
            you and compute leaderboards.
          </li>
          <li>
            <strong>Public Roblox data of looked-up users.</strong> Usernames,
            display names, and avatars retrieved through Roblox&rsquo;s public
            APIs when you search for or view a user.
          </li>
        </ul>
        <p>
          We do not collect passwords, payment information, or any Roblox data
          beyond what is described above.
        </p>
      </section>

      <section className="privacy-section">
        <h2>3. How we use information</h2>
        <p>
          We use the information solely to operate and provide the Service:
          authenticating you, displaying profiles and avatars you look up,
          recording and showing ratings, and building leaderboards. We do not
          use Roblox data for any purpose not described in this policy.
        </p>
      </section>

      <section className="privacy-section">
        <h2>4. What we never do with your data</h2>
        <p>In keeping with Roblox&rsquo;s Third Party App Policy, we will not:</p>
        <ul>
          <li>sell, rent, or trade any data obtained through Roblox APIs;</li>
          <li>
            use any Roblox data to train artificial-intelligence or
            machine-learning models;
          </li>
          <li>
            use Roblox data for advertising, or share it with advertisers or
            data brokers; or
          </li>
          <li>
            collect or use data for any purpose not expressly stated in this
            policy.
          </li>
        </ul>
      </section>

      <section className="privacy-section">
        <h2>5. How we share information</h2>
        <p>
          We do not sell your data and we do not share it with third parties for
          their own purposes. Ratings and leaderboard standings are visible to
          other signed-in RoRater users as part of the Service&rsquo;s core
          function. We may disclose information if required by law or to comply
          with a valid legal request.
        </p>
      </section>

      <section className="privacy-section">
        <h2>6. Data retention and deletion</h2>
        <p>
          We keep your data only as long as needed to provide the Service. If
          you delete your ratings or ask us to remove your account, we delete
          the associated data. Consistent with Roblox&rsquo;s policy, if Roblox
          revokes or terminates our access to its APIs for any reason, we will
          stop using and expunge all data obtained through those APIs.
        </p>
      </section>

      <section className="privacy-section">
        <h2>7. Your choices and rights</h2>
        <p>You may, at any time:</p>
        <ul>
          <li>review and delete the ratings you have submitted;</li>
          <li>
            request access to, correction of, or deletion of the personal data
            we hold about you; and
          </li>
          <li>
            revoke RoRater&rsquo;s access from your Roblox account&rsquo;s
            connected-apps settings, which stops future data sharing.
          </li>
        </ul>
        <p>
          If you are a Roblox user and want your account excluded from RoRater,
          email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and
          we will remove the relevant data.
        </p>
      </section>

      <section className="privacy-section">
        <h2>8. Children&rsquo;s privacy</h2>
        <p>
          RoRater is not directed to children, and we do not knowingly collect
          personal information from children beyond the basic profile data
          Roblox provides at login. If you believe a child&rsquo;s data has been
          collected in a way that violates applicable law, contact us and we
          will delete it.
        </p>
      </section>

      <section className="privacy-section">
        <h2>9. Security</h2>
        <p>
          We take reasonable measures to protect the information we hold. No
          method of transmission or storage is completely secure, however, and
          we cannot guarantee absolute security.
        </p>
      </section>

      <section className="privacy-section">
        <h2>10. Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we
          will revise the &ldquo;last updated&rdquo; date above. Continued use
          of the Service after a change means you accept the updated policy.
        </p>
      </section>

      <section className="privacy-section">
        <h2>11. Contact</h2>
        <p>
          Questions about this Privacy Policy or your data? Email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>
    </article>
  )
}

export default PrivacyPage
