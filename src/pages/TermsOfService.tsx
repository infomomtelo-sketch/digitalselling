import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using dropvault, you agree to be bound by these Terms of Service. If you do not agree, you may not use our platform.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">2. Account Registration</h2>
            <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials and for all activity under your account.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">3. Creator Responsibilities</h2>
            <p>Creators are responsible for the content they upload and sell. You must own or have proper licensing for all digital products listed on dropvault. Prohibited content includes anything illegal, infringing, or harmful.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">4. Buyer Rights</h2>
            <p>Purchases grant you a personal, non-transferable license to use the digital product as described by the creator. Redistribution or resale is prohibited unless explicitly permitted.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">5. Payments & Fees</h2>
            <p>dropvault charges a platform fee on each transaction. Creators receive payouts according to the schedule outlined in their dashboard. All fees are non-refundable unless required by law.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">6. Refund Policy</h2>
            <p>Due to the digital nature of products, refunds are handled on a case-by-case basis. Buyers may request a refund within 14 days of purchase if the product is materially different from its description.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">7. Intellectual Property</h2>
            <p>dropvault and its original content, features, and functionality are owned by dropvault and are protected by copyright, trademark, and other intellectual property laws.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">8. Termination</h2>
            <p>We reserve the right to suspend or terminate your account for violation of these terms. You may delete your account at any time through your dashboard settings.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>dropvault is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">10. Contact</h2>
            <p>For questions about these terms, contact us at <a href="mailto:legal@dropvault.com" className="text-primary hover:underline">legal@dropvault.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
