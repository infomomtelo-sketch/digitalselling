import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide directly, including your name, email address, payment information, and any content you upload. We also automatically collect usage data such as IP address, browser type, and interaction patterns.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve our services, process transactions, communicate with you, and ensure platform security. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">3. Data Storage & Security</h2>
            <p>Your data is stored securely using industry-standard encryption. We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">4. Cookies</h2>
            <p>We use essential cookies to maintain your session and preferences. For more details, see our <Link to="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">5. Third-Party Services</h2>
            <p>We may share data with trusted third-party services for payment processing, analytics, and email delivery. These providers are bound by their own privacy policies and data processing agreements.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">6. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. You can also request data portability or withdraw consent at any time by contacting us at privacy@dropvault.com.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">7. Changes to This Policy</h2>
            <p>We may update this policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@dropvault.com" className="text-primary hover:underline">privacy@dropvault.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
