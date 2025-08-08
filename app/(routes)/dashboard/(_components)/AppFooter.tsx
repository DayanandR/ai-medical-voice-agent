"use client";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="mt-auto border-t bg-background text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-20 lg:px-40 py-6">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-bold">AI Medical Assistant</h2>
          <p className="text-sm text-muted-foreground">
            Your voice-powered healthcare companion.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-4 text-sm">
          <Link
            href="/privacy"
            className="hover:underline text-muted-foreground"
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline text-muted-foreground">
            Terms of Use
          </Link>
          <Link
            href="/contact"
            className="hover:underline text-muted-foreground"
          >
            Contact
          </Link>
        </div>
      </div>

      <div className="border-t py-2 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} AI Medical Assistant. All rights
        reserved.
      </div>
    </footer>
  );
}
