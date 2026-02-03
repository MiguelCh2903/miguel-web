"use client";

import { MessageSquare } from "lucide-react";
import { lazy, Suspense } from "react";
import { sections } from "@/components/sections/sections-config";
import { Navbar } from "@/components/navbar";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Lazy load del sidebar para reducir bundle inicial
const AIChatSidebar = lazy(() =>
  import("@/components/ai-chat-sidebar").then((mod) => ({
    default: mod.AIChatSidebar,
  })),
);

function HomeContent() {
  const { open } = useSidebar();

  return (
    <div className="flex min-h-screen w-full">
      {/* Main Content */}
      <SidebarInset className="flex-1">
        {/* Navbar Component */}
        <Navbar />

        {/* Page Content - Renderiza todas las secciones en orden */}
        <main>
          {sections.map(({ id, component: Component }) => (
            <section key={id} id={id}>
              <Component />
            </section>
          ))}
        </main>
      </SidebarInset>

      {/* AI Chat Sidebar - Renderiza solo si está abierto con lazy loading */}
      {open && (
        <Suspense
          fallback={<div className="w-80 border-l animate-pulse bg-muted/20" />}
        >
          <AIChatSidebar />
        </Suspense>
      )}

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
