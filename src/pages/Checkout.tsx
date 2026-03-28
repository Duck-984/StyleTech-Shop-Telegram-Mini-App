import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useTranslation } from '../hooks/useTranslation';
import { useCartStore } from '../store/useCartStore';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/utils';
import { hapticNotification, getTelegramUser } from '../lib/telegram';

const cities = [
  'Ташкент',
  'Самарканд',
  'Бухара',
  'Андижан',
  'Наманган',
  'Фергана',
  'Коканд',
  'Нукус',
  'Термез',
  'Карши',
];

export const Checkout = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const telegramUserId = useAppStore((state) => state.telegramUserId);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: cities[0],
    address: '',
    deliveryType: 'standard',
    paymentMethod: 'cash',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const deliveryCost = formData.deliveryType === 'express' ? 50000 : 20000;
  const totalAmount = getTotalPrice() + deliveryCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = getTelegramUser();
      const userId = user?.id || telegramUserId || 0;

      const { data, error } = await supabase
        .from('orders')
        .insert({
          telegram_user_id: userId,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
          total_amount: totalAmount,
          status: 'new',
          customer_info: {
            name: formData.fullName,
            phone: formData.phone,
            city: formData.city,
            address: formData.address,
          },
          delivery_type: formData.deliveryType,
          delivery_cost: deliveryCost,
          payment_method: formData.paymentMethod,
          notes: formData.notes,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setOrderId(data.id);
        setOrderPlaced(true);
        clearCart();
        hapticNotification('success');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      hapticNotification('error');
      alert(t('error'));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  if (orderPlaced) {
    return (
      <Layout showBottomNav={false}>
        <div className="container mx-auto px-4 py-12 text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('order_success')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            {t('order_number')}: <span className="font-mono">{orderId.slice(0, 8)}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Мы свяжемся с вами в ближайшее время
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              {t('order_history')}
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('continue_shopping')}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showBottomNav={false}>
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {t('checkout')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('customer_info')}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('full_name')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('phone')} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('city')} *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('address')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('delivery')}
            </h2>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t('delivery_standard')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatPrice(20000)}
                  </p>
                </div>
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={formData.deliveryType === 'standard'}
                  onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t('delivery_express')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatPrice(50000)}
                  </p>
                </div>
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={formData.deliveryType === 'express'}
                  onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('payment_method')}
            </h2>

            <div className="space-y-2">
              {['cash', 'card', 'payme', 'click'].map((method) => (
                <label
                  key={method}
                  className="flex items-center justify-between p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {t(`payment_${method}` as any)}
                  </span>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-5 h-5"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Товары:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Доставка:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatPrice(deliveryCost)}
                </span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 flex justify-between">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('total')}:
                </span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            {loading ? t('loading') : t('place_order')}
          </button>
        </form>
      </div>
    </Layout>
  );
};
