import { Home, ShoppingBag, Package, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useCartStore } from '../store/useCartStore';
import { cn } from '../lib/utils';

export const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const navItems = [
    { path: '/catalog', icon: Home, label: t('catalog'), badge: 0 },
    { path: '/cart', icon: ShoppingBag, label: t('cart'), badge: totalItems },
    { path: '/orders', icon: Package, label: t('orders'), badge: 0 },
    { path: '/profile', icon: User, label: t('profile'), badge: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pb-safe">
      <div className="flex items-stretch justify-around h-14">
        {navItems.map(({ path, icon: Icon, label, badge }) => {
          const isActive = location.pathname === path ||
            (path === '/catalog' && location.pathname.startsWith('/product'));
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 gap-0.5 relative transition-colors',
                isActive
                  ? 'text-blue-500'
                  : 'text-gray-500 dark:text-gray-400 active:text-gray-700 dark:active:text-gray-200'
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </div>
              <span className={cn("text-[10px]", isActive && "font-semibold")}>{label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
