import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Expatriates 360",
  description: "The terms and conditions governing your use of the Expatriates 360 platform.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background px-4 sm:px-6 py-16 mt-10">
      <article className="prose prose-slate dark:prose-invert max-w-3xl mx-auto">
        <h1>Terms of Service</h1>
        <p className="lead">
          <strong>Last Updated: April 16, 2026</strong>
        </p>
        <p>
          By accessing and using Expatriates 360, you agree to comply with and be bound by the
          following terms and conditions.
        </p>

        <h2>1. User Accounts</h2>
        <ul>
          <li>
            You must provide accurate, complete, and current information when creating an account.
          </li>
          <li>
            You are responsible for safeguarding the password that you use to access the service and
            for any activities or actions under your password.
          </li>
        </ul>

        <h2>2. User Content &amp; Conduct</h2>
        <ul>
          <li>
            <strong>Job Seekers:</strong> You are solely responsible for the accuracy of the
            information provided in your profile and uploaded CVs.
          </li>
          <li>
            <strong>Marketplace &amp; Employers:</strong> You agree not to post false, misleading,
            or fraudulent listings.
          </li>
          <li>
            We reserve the right to remove any content or ban any user that violates these terms,
            posts illegal content, or engages in fraudulent activity.
          </li>
        </ul>

        <h2>3. Platform Liability</h2>
        <p>
          Expatriates 360 acts solely as a connecting platform between job seekers, employers, and
          marketplace buyers/sellers.
        </p>
        <ul>
          <li>We do not guarantee employment or the accuracy of employer listings.</li>
          <li>
            For the Marketplace, we are not a party to any physical transactions or agreements made
            between users. All purchases and agreements are made strictly at your own risk.
          </li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          The Expatriates 360 logo, design, and original platform code are the property of
          Expatriates 360. You may not copy, modify, or distribute our intellectual property
          without permission.
        </p>

        <h2>5. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. We will provide notice
          of any significant changes on our website.
        </p>

        <h2>6. Contact Us</h2>
        <p>
          For any questions regarding these Terms, please contact us at{" "}
          <a href="mailto:admin@expatriates360.com">admin@expatriates360.com</a>.
        </p>
      </article>
    </main>
  );
}
