"use client";
import { Button } from "@/components/ui/button";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { MailIcon } from "lucide-react";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t bg-background text-foreground mt-10 h-36 relative">
      {/* Main content container */}
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-20 lg:px-40 pt-6 pb-8 h-full">
        {/* Top section with main content */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 mb-auto">
          {/* Left: Branding */}
          <div className="text-center md:text-left">
            <h2 className="text-lg font-bold leading-tight">
              AI Medical Assistant
            </h2>
            <p className="text-sm text-muted-foreground leading-tight">
              Your voice-powered healthcare companion.
            </p>
          </div>

          {/* Middle: Navigation */}
          <div className="flex gap-4 text-sm">
            <Link
              href="/privacy"
              className="hover:underline text-muted-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:underline text-muted-foreground"
            >
              Terms of Use
            </Link>
            <Link
              href="/contact"
              className="hover:underline text-muted-foreground"
            >
              Contact
            </Link>
          </div>

          {/* Right: Social Icons */}
          <div className="flex gap-3">
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://github.com/your-repo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithub className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="mailto:support@yourapp.com">
                <MailIcon className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://twitter.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandTwitter className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandLinkedin className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>

        {/* Bottom copyright - positioned at bottom */}
        <div className="absolute bottom-2 left-0 right-0">
          <p className="text-xs text-center text-muted-foreground px-6">
            &copy; {new Date().getFullYear()} AI Medical Assistant. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
