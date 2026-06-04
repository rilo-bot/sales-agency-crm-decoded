import { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { LayoutGrid, BarChart2, Users, LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';

const NAV_ITEMS = [
  { to: '/pipeline', label: 'Pipeline', Icon: LayoutGrid },
  { to: '/metrics', label: 'Metrics', Icon: BarChart2 },
  { to: '/team', label: 'Team', Icon: Users },
];

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = useAuthStore((s) => s.currentUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('You have been signed out.');
    navigate('/login');
  };

  const initials = currentUser?.name
    ? currentUser.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'AF';

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--parchment)' }}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-foreground/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex flex-col w-64 transition-transform duration-200 md:translate-x-0 md:static md:flex',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ background: 'var(--navy)' }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-6 py-6 border-b"
          style={{ borderColor: 'var(--navy-border)' }}
        >
          <span
            className="text-2xl font-semibold tracking-wide text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AgencyFlow
          </span>
          <button
            className="md:hidden text-primary-foreground/70 hover:text-primary transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 relative group',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-primary-foreground/70 hover:text-primary-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-primary"
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    size={17}
                    className={cn(isActive ? 'text-primary' : 'text-primary-foreground/50')}
                  />
                  <span className="tracking-[0.04em] uppercase text-[0.7rem] font-semibold">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div
          className="px-4 pb-6 border-t pt-4"
          style={{ borderColor: 'var(--navy-border)' }}
        >
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-primary/25 text-primary">
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="text-primary-foreground/90 text-xs font-semibold truncate">
                {currentUser?.name ?? 'Agent'}
              </p>
              <p className="text-primary-foreground/40 text-[0.65rem] truncate">
                {currentUser?.email ?? ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-md text-primary-foreground/50 hover:text-primary-foreground/80 hover:bg-primary/10 transition-colors duration-150 text-xs tracking-[0.04em] uppercase font-semibold"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile topbar */}
        <header
          className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 z-10"
          style={{ background: 'var(--navy)' }}
        >
          <span
            className="text-xl font-semibold text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            AgencyFlow
          </span>
          <button
            onClick={() => setMobileOpen(true)}
            className="text-primary-foreground/70 hover:text-primary"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
