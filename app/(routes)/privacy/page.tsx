export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-4">
        This Privacy Policy explains how we collect, use, and protect your
        information when you use our AI Medical Assistant platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc list-inside text-muted-foreground">
        <li>Personal details (e.g., name, email address)</li>
        <li>Session notes and symptom descriptions</li>
        <li>Usage data and device information</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        2. How We Use Your Information
      </h2>
      <p className="text-muted-foreground">
        We use your data to provide, improve, and personalize your experience.
        We do not sell your data to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Security</h2>
      <p className="text-muted-foreground">
        We implement strict security measures to protect your data from
        unauthorized access.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Contact Us</h2>
      <p className="text-muted-foreground">
        If you have any questions, email us at{" "}
        <a href="mailto:support@yourapp.com" className="underline">
          support@yourapp.com
        </a>
        .
      </p>
    </div>
  );
}
