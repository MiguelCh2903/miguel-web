"use client";

import { MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { sections } from "@/components/sections/sections-config";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navSections = sections.filter(
  (section) => section.id !== "hero" && section.id !== "footer",
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detectar sección activa
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <button
          onClick={() => scrollToSection("hero")}
          className="text-xl font-bold hover:opacity-80 transition-opacity"
        >
          Miguel Chumacero
        </button>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors rounded-lg relative",
                activeSection === section.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {section.name}
              {activeSection === section.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-foreground rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Mobile Navigation & Chat Button */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <select
              value={activeSection}
              onChange={(e) => scrollToSection(e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-lg bg-background"
            >
              {navSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Chat Trigger */}
          <SidebarTrigger className="gap-2 h-9 px-3">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden md:inline">Chat IA</span>
          </SidebarTrigger>
        </div>
      </div>
    </header>
  );
}
