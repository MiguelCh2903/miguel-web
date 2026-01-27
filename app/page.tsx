"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { AIChatSidebar } from "@/components/ai-chat-sidebar";
import { MessageSquare } from "lucide-react";
import { sections } from "@/components/sections/sections-config";
import { useEffect, useState } from "react";

function HomeContent() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { open } = useSidebar();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Main Content */}
      <SidebarInset className="flex-1">
        {/* Header with Sidebar Toggle */}
        <header
          className={`sticky top-0 z-10 flex h-16 items-center justify-between bg-background/95 px-4 backdrop-blur transition-shadow duration-200 supports-backdrop-filter:bg-background/60 ${
            isScrolled ? "border-b shadow-sm" : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">Miguel Chumacero</span>
          </div>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="gap-2 h-9 px-3">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Chat IA</span>
            </SidebarTrigger>
          </div>
        </header>

        {/* Page Content - Renderiza todas las secciones en orden */}
        <main>
          {sections.map(({ id, component: Component }) => (
            <section key={id} id={id}>
              <Component />
            </section>
          ))}
        </main>
      </SidebarInset>

      {/* AI Chat Sidebar - Renderiza solo si está abierto */}
      {open && <AIChatSidebar />}

      {/* Floating trigger button when sidebar is closed */}
      {!open && (
        <SidebarTrigger className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg">
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Abrir chat</span>
        </SidebarTrigger>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <SidebarProvider defaultOpen={true}>
      <HomeContent />
    </SidebarProvider>
  );
}
