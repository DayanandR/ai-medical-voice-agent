"use client";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";

const MenuOptions = [
  { id: 1, name: "Home", path: "/" },
  { id: 2, name: "History", path: "/history" },
  { id: 3, name: "Pricing", path: "/pricing" },
];

const AppHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full border-b px-4 py-4">
      <nav className="flex items-center justify-between mt-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <span className="text-primary text-lg">🩺</span>
          </div>
          <h1 className="text-sky-700 font-bold md:text-2xl">MedVoice AI</h1>
        </Link>

        <div className="hidden md:flex gap-4 justify-center flex-1">
          {MenuOptions.map((menu) => (
            <Link key={menu.id} href={menu.path}>
              <Button className="text-md" variant="link">
                {menu.name}
              </Button>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="text-gray-700 focus:outline-none cursor-pointer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "h-[50px] w-[50px]",
                userButtonTrigger:
                  "rounded-full ring-2 ring-blue-500 hover:ring-blue-600 transition",
              },
            }}
          />
        </div>
      </nav>

      {isMenuOpen && (
        <div className="flex flex-col items-start mt-4 md:hidden gap-2">
          {MenuOptions.map((menu) => (
            <Link key={menu.id} href={menu.path} className="w-full">
              <Button
                variant="ghost"
                className="w-full justify-center text-left cursor-pointer "
                onClick={() => setIsMenuOpen(false)}
              >
                {menu.name}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppHeader;
