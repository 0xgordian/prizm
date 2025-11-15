"use client";

import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ModeToggle />
    </div>
  );
}