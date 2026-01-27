"use client";

import { useCallback } from "react";

export function useChatActions() {
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Destacar temporalmente la sección
      element.classList.add("ring-2", "ring-blue-500", "ring-opacity-50");
      setTimeout(() => {
        element.classList.remove("ring-2", "ring-blue-500", "ring-opacity-50");
      }, 2000);

      return true;
    }
    return false;
  }, []);

  const downloadCV = useCallback(() => {
    const link = document.createElement("a");
    link.href = "/cv.pdf";
    link.download = "Miguel_CV.pdf";
    link.click();
    return true;
  }, []);

  const executeAction = useCallback(
    (action: any) => {
      switch (action.action) {
        case "navigate":
          return scrollToSection(action.section);
        case "download":
          return downloadCV();
        default:
          return false;
      }
    },
    [scrollToSection, downloadCV],
  );

  return {
    executeAction,
    scrollToSection,
    downloadCV,
  };
}
