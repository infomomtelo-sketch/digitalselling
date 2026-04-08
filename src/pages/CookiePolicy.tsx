import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>

        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">Cookie Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">1. What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">2. Essential Cookies</h2>
            <p>These cookies are necessary for the platform to function. They include session cookies for authentication and security tokens. You cannot opt out of essential cookies.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">3. Analytics Cookies</h2>
            <p>We use analytics cookies to understand how visitors interact with dropvault. This data helps us improve our platform. Analytics data is aggregated and anonymized.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">4. Preference Cookies</h2>
            <p>These cookies remember your settings and preferences, such as language and display options, to provide a personalized experience.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">5. Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling certain cookies may affect the functionality of the platform. Most browsers allow you to block or delete cookies.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground">6. Contact</h2>
            <p>For questions about our cookie practices, contact us at <a href="mailto:privacy@dropvault.com" className="text-primary hover:underline">privacy@dropvault.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
