"use client";

import { useCallback } from "react";

interface ChatAction {
	action: string;
	section?: string;
	file?: string;
	filename?: string;
	title?: string;
	message?: string;
	data?: {
		email?: string;
		github?: string;
		location?: string;
	};
	[key: string]: unknown;
}

export function useChatActions() {
	const scrollToSection = useCallback((sectionId: string) => {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});

			// Destacar temporalmente la sección con un efecto visual
			element.classList.add(
				"ring-2",
				"ring-primary/50",
				"ring-offset-2",
				"ring-offset-background",
				"transition-all",
				"duration-300",
			);
			setTimeout(() => {
				element.classList.remove(
					"ring-2",
					"ring-primary/50",
					"ring-offset-2",
					"ring-offset-background",
					"transition-all",
					"duration-300",
				);
			}, 2000);

			return true;
		}
		return false;
	}, []);

	const downloadCV = useCallback(
		(filename = "Miguel_Chumacero_CV.pdf") => {
			const link = document.createElement("a");
			link.href = "/cv.pdf";
			link.download = filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			return true;
		},
		[],
	);

	const openEmail = useCallback((email: string) => {
		window.location.href = `mailto:${email}`;
		return true;
	}, []);

	const openGitHub = useCallback((url: string) => {
		window.open(url, "_blank", "noopener,noreferrer");
		return true;
	}, []);

	const executeAction = useCallback(
		(action: ChatAction) => {
			switch (action.action) {
				case "navigate":
					return scrollToSection(action.section || "");

				case "download":
					return downloadCV(action.filename);

				case "showContact":
					// Navegar a la sección de contacto
					scrollToSection("contact");
					return true;

				case "openEmail":
					if (action.data?.email) {
						return openEmail(action.data.email);
					}
					return false;

				case "openGitHub":
					if (action.data?.github) {
						return openGitHub(action.data.github);
					}
					return false;

				default:
					console.log("Acción no reconocida:", action);
					return false;
			}
		},
		[scrollToSection, downloadCV, openEmail, openGitHub],
	);

	return {
		executeAction,
		scrollToSection,
		downloadCV,
		openEmail,
		openGitHub,
	};
}
