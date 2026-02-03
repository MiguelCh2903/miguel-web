import { Github, Heart, Mail, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { contactInfo } from "@/lib/contact-info";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      href: contactInfo.social.github,
      label: "Visita mi GitHub",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:${contactInfo.email}`,
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
        { name: "Contacto", href: "#contact" },
      ],
    },
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold mb-3">{contactInfo.name}</h3>
            <p className="text-muted-foreground mb-2">{contactInfo.tagline}</p>
            <p className="text-muted-foreground mb-4 max-w-md">
              Especializado en {contactInfo.expertise.join(", ")}. Transformando
              ideas en soluciones tecnológicas de vanguardia.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              {contactInfo.location}
            </div>
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
          <p>
            © {currentYear} Miguel Chumacero. Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1">
            Creando el futuro, línea a línea.
          </p>
        </div>
      </div>
    </footer>
  );
}
