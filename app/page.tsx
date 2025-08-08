"use client";

import { motion } from "motion/react";
import { FeatureBentoGrid } from "./_components/FeatureBentoGrid";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSectionOne() {
  return (
    <div className="relative my-4 flex flex-col items-center justify-center">
      <Navbar />
      <div className="absolute inset-y-0 left-0 h-full w-px bg-border">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-border">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-border">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-foreground md:text-4xl lg:text-7xl">
          {"🏥 Transform Healthcare with AI Medical Voice Agents"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-muted-foreground"
        >
          Revolutionize patient care with intelligent voice-powered medical
          assistants. Provide instant symptom analysis, automated triage,
          appointment scheduling, and compassionate healthcare guidance
          available 24/7.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            Start Free Trial
          </button>
          <button className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            Watch Demo
          </button>
        </motion.div>

        {/* Medical Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="relative z-10 mt-12 flex flex-wrap justify-center gap-8 text-center"
        >
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-primary">99.7%</span>
            <span className="text-sm text-muted-foreground">Accuracy Rate</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-primary">24/7</span>
            <span className="text-sm text-muted-foreground">Availability</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-primary">50+</span>
            <span className="text-sm text-muted-foreground">Languages</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-primary">2s</span>
            <span className="text-sm text-muted-foreground">Response Time</span>
          </div>
        </motion.div>

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
        >
          <div className="w-full overflow-hidden rounded-md border">
            {/* Medical Dashboard Preview */}
            <div className="aspect-[16/9] bg-muted/50 flex items-center justify-center relative">
              {/* Simulated Medical Interface */}
              <div className="absolute top-4 left-4 right-4 bg-card rounded-lg p-4 shadow-lg border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-card-foreground">
                    AI Medical Assistant - Live
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted p-2 rounded text-xs">
                    👤 Patient: "I have been experiencing chest pain and
                    shortness of breath..."
                  </div>
                  <div className="bg-muted p-2 rounded text-xs">
                    🤖 AI: "I understand your concern. Based on your symptoms,
                    I'm prioritizing this as urgent. Let me connect you with
                    emergency services immediately..."
                  </div>
                </div>
              </div>

              {/* Medical Icons Floating */}
              <div className="absolute bottom-10 left-10 opacity-20">
                <div className="text-6xl">🩺</div>
              </div>
              <div className="absolute bottom-16 right-16 opacity-20">
                <div className="text-4xl">💊</div>
              </div>
              <div className="absolute top-20 right-10 opacity-20">
                <div className="text-5xl">🏥</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="relative z-10 mt-12 flex flex-wrap justify-center items-center gap-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground">
            <span>🔒</span>
            <span className="text-sm font-medium">HIPAA Compliant</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground">
            <span>🛡️</span>
            <span className="text-sm font-medium">FDA Approved</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground">
            <span>⚡</span>
            <span className="text-sm font-medium">ISO 27001 Certified</span>
          </div>
        </motion.div>
      </div>
      <div>
        <FeatureBentoGrid />
      </div>
    </div>
  );
}

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav className="flex w-full items-center justify-between border-b px-4 py-4">
      <Link href={"/"}>
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary text-lg">🩺</span>
          </div>
          <h1 className="text-sky-700 font-bold md:text-2xl">MedVoice AI</h1>
        </div>
      </Link>
      <div className="flex items-center gap-3">
        {!user ? (
          <Button className="cursor-pointer">Login</Button>
        ) : (
          <div className="flex items-center gap-6">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-[50px] w-[50px]",
                  userButtonTrigger:
                    "rounded-full ring-2 ring-blue-500 hover:ring-blue-600 transition",
                },
              }}
            />
            <Link href={"/dashboard"}>
              <Button className="cursor-pointer">Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
