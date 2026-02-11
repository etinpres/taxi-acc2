'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, BarChart3, Car, Settings } from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', href: '/', icon: Home },
  { label: '일별', href: '/daily', icon: Calendar },
  { label: '월별', href: '/monthly', icon: BarChart3 },
  { label: '운행', href: '/driving', icon: Car },
  { label: '설정', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:static md:border-b md:border-gray-200">
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200/60 safe-bottom md:bg-white md:backdrop-blur-none">
        <div className="max-w-lg mx-auto flex justify-around">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center py-2.5 px-3 min-w-[56px] transition-all duration-200 ${
                  isActive ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
