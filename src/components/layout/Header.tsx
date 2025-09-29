import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
];
export function Header() {
  const isMobile = useIsMobile();
  const renderNavLinks = () => (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          className={({ isActive }) =>
            cn(
              "text-lg font-medium transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground"
            )
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl font-display">Zenith Bills</span>
        </Link>
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col items-start gap-6 pt-12">
                {renderNavLinks()}
                <Button asChild className="w-full">
                  <Link to="/auth">Login</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="hidden md:flex items-center gap-6">
            {renderNavLinks()}
            <Button asChild>
              <Link to="/auth">Login</Link>
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}