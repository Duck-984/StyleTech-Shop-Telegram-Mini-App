import { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { supabase, Database } from '../lib/supabase';
import { formatPrice, getLocalizedValue } from '../lib/utils';
import { getTelegramUser } from '../lib/telegram';

type Order = Database['public']['Tables']['orders']['Row'];

export const Orders = () => {
  const { t, language } = useTranslation();
  const telegramUserId = useAppStore((state) => state.telegramUserId);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [telegramUserId]);

  const loadOrders = async () => {
    setLoading(true);
    const user = getTelegramUser();
    const userId = user?.id || telegramUserId || 0;

    if (userId) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('telegram_user_id', userId)
        .order('created_at', { ascending: false });

      if (data) {
        setOrders(data);
      }
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('no_orders')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('continue_shopping')}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('order_history')}
        </h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('order_number')}: <span className="font-mono">{order.id.slice(0, 8)}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'uz-UZ', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {t(`status_${order.status}` as any)}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                {(order.items as any[]).map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={getLocalizedValue(item.name, language)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {getLocalizedValue(item.name, language)}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {item.quantity} × {formatPrice(item.price)}
                        {item.size && ` • ${t('size')}: ${item.size}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{t('total')}:</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
