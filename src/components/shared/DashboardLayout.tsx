'use client';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/participantes', label: 'Participantes' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-apple-bg flex">
      <aside className="w-64 border-r border-black/5 bg-white p-4 hidden md:flex md:flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-apple-text">Painel</h2>
          <p className="text-xs text-apple-gray">Organizador de eventos</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-apple px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-apple-blue/10 text-apple-blue'
                    : 'text-apple-gray hover:bg-apple-bg hover:text-apple-text'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          <Button variant="secondary" className="w-full" onClick={logout}>
            Sair
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10">{children}</main>
    </div>
  );
}
