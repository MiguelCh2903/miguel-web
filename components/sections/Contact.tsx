"use client";

import {
  Download,
  ExternalLink,
  Github,
  Mail,
  MessageSquare,
} from "lucide-react";
import { DownloadCVButton } from "@/components/download-cv-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { contactInfo } from "@/lib/contact-info";

export function ContactSection() {
  const { setOpen } = useSidebar();
  return (
    <section className="py-12 bg-linear-to-br from-background to-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            ¿Listo para Colaborar?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Estoy siempre abierto a nuevas oportunidades y proyectos
            desafiantes. No dudes en contactarme para discutir cómo podemos
            trabajar juntos.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contacto directo */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Contacto Directo</h3>

            <div className="space-y-4">
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-all duration-200 hover:border-primary/50 group"
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    {contactInfo.email}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </a>

              <a
                href={contactInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg border hover:shadow-md transition-all duration-200 hover:border-primary/50 group"
              >
                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <Github className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium">GitHub</div>
                  <div className="text-sm text-muted-foreground">
                    Explora mi código
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Recursos */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4">Recursos</h3>

            <div className="space-y-4">
              <div className="p-6 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Curriculum Vitae
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Descarga mi CV completo con todos los detalles de mi
                  experiencia y proyectos.
                </p>
                <DownloadCVButton />
              </div>

              <div className="p-6 rounded-lg border bg-card">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat con IA
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  ¿Preguntas específicas? Mi asistente de IA puede ayudarte con
                  información detallada.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setOpen(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Iniciar Chat
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">¿Trabajamos Juntos?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Si tienes un proyecto interesante, una oportunidad laboral, o
            simplemente quieres discutir sobre tecnología e innovación, estaré
            encantado de conversar contigo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <a href={`mailto:${contactInfo.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
