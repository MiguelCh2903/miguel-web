"use client";

import { MessageSquare } from "lucide-react";
import { lazy, Suspense } from "react";
import { sections } from "@/components/sections/sections-config";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

// Lazy load del sidebar para reducir bundle inicial
const AIChatSidebar = lazy(() =>
  import("@/components/ai-chat-sidebar").then((mod) => ({
    default: mod.AIChatSidebar,
  })),
);

function HomeContent() {
  const { isMobile, open, openMobile, setOpen, setOpenMobile } = useSidebar();
  const isChatClosed = isMobile ? !openMobile : !open;
  const handleOpenChat = () => {
    if (isMobile) {
      setOpenMobile(true);
      return;
    }
    setOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Main Content */}
      <SidebarInset className="flex-1 bg-transparent">
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

      {/* AI Chat Sidebar - siempre montado, visibilidad manejada por el componente Sidebar */}
      <Suspense fallback={<div className="w-0" />}>
        <AIChatSidebar />
      </Suspense>

      {/* Floating trigger button when sidebar is closed */}
      {isChatClosed && (
        <Button
          type="button"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg"
          onClick={handleOpenChat}
        >
          <MessageSquare className="h-6 w-6" />
          <span className="sr-only">Abrir chat</span>
        </Button>
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
