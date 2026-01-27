import { Github, Linkedin, Mail, Twitter, Heart } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/tu-usuario",
      label: "Visita mi GitHub",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://linkedin.com/in/tu-perfil",
      label: "Conéctate en LinkedIn",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "https://twitter.com/tu-usuario",
      label: "Sígueme en Twitter",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:tu-email@ejemplo.com",
      label: "Envíame un email",
    },
  ];

  const footerLinks = [
    {
      title: "Navegación",
      links: [
        { name: "Inicio", href: "#hero" },
        { name: "Educación", href: "#education" },
        { name: "Habilidades", href: "#skills" },
        { name: "Experiencia", href: "#experience" },
        { name: "Proyectos", href: "#projects" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "CV / Resume", href: "/cv" },
        { name: "Portafolio", href: "#projects" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold mb-3">Miguel</h3>
            <p className="text-muted-foreground mb-4 max-w-md">
              Desarrollador Full Stack apasionado por crear soluciones
              innovadoras y experiencias digitales excepcionales.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center h-10 w-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} Miguel. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="h-4 w-4 text-red-500 fill-red-500" />{" "}
            usando Next.js & shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  );
}
