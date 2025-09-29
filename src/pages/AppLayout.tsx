import { useEffect } from 'react';
import { Outlet, useNavigate, Link, NavLink } from 'react-router-dom';
import { useAuthStore, getSubdomain } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Zap,
} from 'lucide-react';
const sidebarNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/customers', icon: Users, label: 'Customers' },
  { to: '/dashboard/plans', icon: CreditCard, label: 'Plans' },
  { to: '/dashboard/invoices', icon: FileText, label: 'Invoices' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];
export function AppLayout() {
  const { isAuthenticated, tenant, logout } = useAuthStore();
  const navigate = useNavigate();
  const subdomain = getSubdomain();
  useEffect(() => {
    if (!isAuthenticated || !tenant || tenant.subdomain !== subdomain) {
      logout();
      // Redirect to the main domain's auth page
      const mainDomain = window.location.host.split('.').slice(-2).join('.');
      window.location.href = `${window.location.protocol}//${mainDomain}/auth`;
    }
  }, [isAuthenticated, tenant, subdomain, navigate, logout]);
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }
  const handleLogout = () => {
    logout();
    const mainDomain = window.location.host.split('.').slice(-2).join('.');
    window.location.href = `${window.location.protocol}//${mainDomain}/auth`;
  };
  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden md:flex w-64 flex-col border-r bg-background p-4">
        <div className="flex items-center gap-2 mb-8">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl font-display">{tenant?.name}</span>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          {sidebarNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  isActive ? 'bg-muted text-primary' : ''
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}