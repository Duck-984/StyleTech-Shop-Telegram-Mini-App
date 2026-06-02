import { ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useTranslation } from '../hooks/useTranslation';

export const Header = () => {
  const { t } = useTranslation();
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95">
      <div className="px-4 h-12 flex items-center justify-between">
        <Link to="/catalog" className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-blue-500" />
          <span className="text-base font-bold text-gray-900 dark:text-white">
            {t('app_name')}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/cart" className="relative p-2 -m-2">
            <ShoppingBag className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {totalItems}
              </span>
            )}
          </Link>

          <Link to="/profile" className="p-2 -m-2">
            <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </Link>
        </div>
      </div>
    </header>
  );
};
