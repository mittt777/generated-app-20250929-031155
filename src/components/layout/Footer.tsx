import { Link } from "react-router-dom";
import { Zap, Twitter, Github, Linkedin } from "lucide-react";
const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Home", href: "/" },
      { label: "Pricing", href: "/pricing" },
      { label: "Sign Up", href: "/auth" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
    ],
  },
];
const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];
export function Footer() {
  return (
    <footer className="bg-muted/40 border-t">
      <div className="container max-w-7xl py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col items-start">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Zap className="h-7 w-7 text-primary" />
              <span className="font-bold text-2xl font-display">Zenith Bills</span>
            </Link>
            <p className="text-muted-foreground max-w-xs">
              The modern billing platform for SaaS businesses.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Zenith Bills, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}