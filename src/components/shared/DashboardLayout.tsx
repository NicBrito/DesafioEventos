'use client';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import { Calendar, LayoutDashboard, LogOut, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/eventos', label: 'Eventos', icon: Calendar },
  { href: '/participantes', label: 'Participantes', icon: Users },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-apple-bg text-apple-text flex">
      {/* Sidebar - Dark Glassmorphism Effect */}
      <aside className="w-64 border-r border-white/10 glass p-6 hidden md:flex md:flex-col z-50">
        <div className="mb-10 px-2">
          <h2 className="text-xl font-black tracking-tighter text-apple-blue uppercase">Painel</h2>
          <p className="text-[10px] text-apple-textSecondary font-bold uppercase tracking-widest mt-1">
            Organizador de eventos
          </p>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-apple px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-apple-blue text-white shadow-lg shadow-apple-blue/20'
                    : 'text-apple-textSecondary hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-apple-blue'} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Logout */}
        <div className="mt-auto pt-6 border-t border-white/5">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-4 py-2 text-apple-textSecondary hover:text-apple-error hover:bg-apple-error/10 transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="font-semibold text-sm">Sair</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area with Smooth Gradient */}
      <main className="flex-1 p-6 md:p-10 bg-gradient-to-b from-apple-bg to-[#0A0A0A] overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}