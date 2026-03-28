import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Package, ShoppingBag, DollarSign, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [] as any[],
  });

  useEffect(() => {
    checkAuth();
    loadStats();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    }
  };

  const loadStats = async () => {
    const [ordersRes, productsRes, recentOrdersRes] = await Promise.all([
      supabase.from('orders').select('total_amount', { count: 'exact' }),
      supabase.from('products').select('id', { count: 'exact' }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    ]);

    const totalRevenue = ordersRes.data?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;

    setStats({
      totalOrders: ordersRes.count || 0,
      totalRevenue,
      totalProducts: productsRes.count || 0,
      recentOrders: recentOrdersRes.data || [],
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Админ-панель
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Всего заказов</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Выручка</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Товары</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Link
            to="/admin/products"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Управление товарами
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Добавление, редактирование и удаление
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Управление заказами
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Просмотр и изменение статусов
                </p>
              </div>
            </div>
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Последние заказы
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentOrders.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                Нет заказов
              </div>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(order.total_amount)}
                      </p>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
