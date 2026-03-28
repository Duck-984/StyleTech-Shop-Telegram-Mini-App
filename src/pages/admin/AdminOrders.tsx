import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase, Database } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';

type Order = Database['public']['Tables']['orders']['Row'];

const statusOptions = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];

export const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadOrders();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id);

    if (!error) {
      setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    }
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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/dashboard"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Заказы
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">Нет заказов</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Заказ #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleString('ru-RU')}
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Покупатель:
                  </p>
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>Имя: {(order.customer_info as any).name}</p>
                    <p>Телефон: {(order.customer_info as any).phone}</p>
                    <p>Город: {(order.customer_info as any).city}</p>
                    <p>Адрес: {(order.customer_info as any).address}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Товары:
                  </p>
                  <div className="space-y-2">
                    {(order.items as any[]).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900 dark:text-white">
                          {item.name.ru}
                          {item.size && ` (${item.size})`}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.quantity} × {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>Доставка: {order.delivery_type}</p>
                    <p>Оплата: {order.payment_method}</p>
                  </div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
