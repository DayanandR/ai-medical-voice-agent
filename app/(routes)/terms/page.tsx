export default function TermsOfUse() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Terms of Use</h1>
      <p className="text-muted-foreground mb-4">
        These Terms of Use govern your use of the AI Medical Assistant platform.
        By using the app, you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h2>
      <p className="text-muted-foreground">
        You must be 13 years or older and provide accurate information. You
        agree not to misuse the platform or its services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. Intellectual Property
      </h2>
      <p className="text-muted-foreground">
        All content on this platform is the property of AI Medical Assistant.
        You may not reproduce or distribute without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Termination</h2>
      <p className="text-muted-foreground">
        We reserve the right to suspend or terminate your access if you violate
        these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact</h2>
      <p className="text-muted-foreground">
        Questions? Reach out to{" "}
        <a href="mailto:support@yourapp.com" className="underline">
          support@yourapp.com
        </a>
        .
      </p>
    </div>
  );
}
