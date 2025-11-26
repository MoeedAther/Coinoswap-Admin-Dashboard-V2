"use client";

import { useState, useEffect } from 'react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Coins,
  ShoppingCart,
  Network,
  RefreshCw,
  Menu,
  X,
  LogOut,
  Shield,
  Settings as SettingsIcon,
  UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Swap Coin', href: '/swap-coin', icon: Coins },
  { name: 'Buy Coin', href: '/buy-coin', icon: ShoppingCart },
  { name: 'Crypto Networks', href: '/networks', icon: Network },
  { name: 'Transactions', href: '/transactions', icon: RefreshCw },
];

const accountPages = [
  { name: 'Admin', href: '/admin', icon: Shield },
  { name: 'Setting', href: '/setting', icon: SettingsIcon },
  { name: 'Setting Exchange', href: '/setting-exchange', icon: SettingsIcon },
  { name: 'Profile', href: '/profile', icon: UserCircle },
];

const SidebarContent = ({ sidebarOpen, onNavClick }) => (
  <>
    <nav className="p-2 sm:p-4 space-y-2 overflow-y-auto">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-smooth text-sm sm:text-base"
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-glow"
        >
          <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          {sidebarOpen && <span className="truncate">{item.name}</span>}
        </NavLink>
      ))}

      {sidebarOpen && (
        <div className="pt-4 pb-2 px-3 sm:px-4">
          <p className="text-xs font-bold text-foreground">ACCOUNT PAGES</p>
        </div>
      )}

      {accountPages.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          onClick={onNavClick}
          className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-smooth text-sm sm:text-base"
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-glow"
        >
          <item.icon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          {sidebarOpen && <span className="truncate">{item.name}</span>}
        </NavLink>
      ))}
    </nav>
  </>
);

export const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border">
          {sidebarOpen && (
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              CoinoSwap
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-sidebar-foreground hover:text-black"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        <SidebarContent sidebarOpen={sidebarOpen} />
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar border-sidebar-border">
          <SidebarContent sidebarOpen={true} onNavClick={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 transition-all duration-300 w-full",
          sidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        {/* Header */}
        <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-foreground"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <h1 className="text-base sm:text-lg font-semibold text-foreground hidden sm:block">
              Admin Panel
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-sidebar-accent">
                <UserCircle className="h-4 w-4 text-sidebar-accent-foreground" />
                <span className="text-sm font-medium text-sidebar-accent-foreground">
                  {user?.email || 'Admin'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
