import { Package, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { useOrders } from '../lib/supabase/hooks';
import { formatPrice, getLocalizedValue } from '../lib/utils';
import { getTelegramUser } from '../lib/telegram';

export const Orders = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const telegramUserId = useAppStore((state) => state.telegramUserId);

  const user = getTelegramUser();
  const userId = user?.id || telegramUserId || 0;

  const { data: orders = [], isLoading } = useOrders(userId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { ru: string; uz: string }> = {
      new: { ru: 'Новый', uz: 'Yangi' },
      processing: { ru: 'В обработке', uz: 'Jarayonda' },
      paid: { ru: 'Оплачен', uz: 'To\'langan' },
      shipped: { ru: 'Отправлен', uz: 'Yuborilgan' },
      delivered: { ru: 'Доставлен', uz: 'Yetkazilgan' },
      cancelled: { ru: 'Отменен', uz: 'Bekor qilingan' },
    };
    return labels[status]?.[language] || status;
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, { ru: string; uz: string }> = {
      cash: { ru: 'Наличные', uz: 'Naqd pul' },
      payme: { ru: 'Payme', uz: 'Payme' },
      click: { ru: 'Click', uz: 'Click' },
      uzum: { ru: 'Uzum Bank', uz: 'Uzum Bank' },
    };
    return labels[method]?.[language] || method;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">{t('loading')}</p>
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
          <button
            onClick={() => navigate('/catalog')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            {t('catalog')}
          </button>
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
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {t('order_number')}: <span className="font-mono font-semibold text-gray-900 dark:text-white">{order.id.slice(0, 8)}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString(
                        language === 'ru' ? 'ru-RU' : 'uz-UZ',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="space-y-2 mb-3">
                  {(order.items as any[]).slice(0, 2).map((item: any, index: number) => (
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
                  {(order.items as any[]).length > 2 && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 pl-15">
                      {language === 'ru' ? 'И еще' : 'Va yana'} {(order.items as any[]).length - 2}{' '}
                      {language === 'ru' ? 'товар(ов)' : 'mahsulot'}
                    </p>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'ru' ? 'Способ оплаты' : 'To\'lov usuli'}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {getPaymentMethodLabel(order.payment_method)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'ru' ? 'Доставка' : 'Yetkazib berish'}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.delivery_type === 'express'
                        ? language === 'ru'
                          ? 'Экспресс'
                          : 'Ekspress'
                        : language === 'ru'
                        ? 'Стандарт'
                        : 'Standart'}{' '}
                      ({formatPrice(order.delivery_cost as number)})
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {t('total')}:
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatPrice(order.total_amount as number)}
                    </span>
                  </div>
                </div>

                {order.status === 'new' && order.payment_method !== 'cash' && (
                  <button
                    onClick={() => {
                      // TODO: Implement payment retry
                      navigate(`/payment/${order.id}`);
                    }}
                    className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    {language === 'ru' ? 'Оплатить заказ' : 'Buyurtmani to\'lash'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
