'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, HelpCircle, User, Download, GraduationCap } from 'lucide-react';

interface MobileBottomNavProps {
  onInstallApp?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onInstallApp }) => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Classes', href: '/onboarding', icon: GraduationCap },
    { label: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-xl px-4 py-2 flex items-center justify-around text-slate-400">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 transition-all text-center py-1 ${
              isActive ? 'text-cyan-400 font-bold scale-105' : 'hover:text-slate-200'
            }`}
          >
            <Icon size={20} className={isActive ? 'text-cyan-400' : ''} />
            <span className="text-[10px] font-medium tracking-tight">{item.label}</span>
          </Link>
        );
      })}

      {onInstallApp && (
        <button
          onClick={onInstallApp}
          className="flex flex-col items-center gap-1 text-amber-400 font-bold hover:text-amber-300 py-1 transition-transform active:scale-95"
        >
          <Download size={20} className="animate-bounce" />
          <span className="text-[10px] tracking-tight">Install App</span>
        </button>
      )}
    </div>
  );
};
