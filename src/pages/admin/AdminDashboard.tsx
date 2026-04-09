import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, LogOut, Users, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentAdmin, logoutAdmin, canManageUsers, canManageOrders, ROLE_LABELS } from '../../lib/auth';
import { formatPrice } from '../../lib/utils';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = getCurrentAdmin();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    recentOrders: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersRes, productsRes, recentRes] = await Promise.all([
        supabase.from('orders').select('total_amount', { count: 'exact' }),
        supabase.from('products').select('id', { count: 'exact' }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      const totalRevenue = ordersRes.data?.reduce(
        (sum, o) => sum + Number(o.total_amount), 0
      ) ?? 0;
      setStats({
        totalOrders: ordersRes.count ?? 0,
        totalRevenue,
        totalProducts: productsRes.count ?? 0,
        recentOrders: recentRes.data ?? [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  if (!admin) return null;

  const statusColors: Record<string, string> = {
    new: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    shipped: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    delivered: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };
  const statusLabels: Record<string, string> = {
    new: 'Новый', processing: 'В обработке', paid: 'Оплачен',
    shipped: 'Отправлен', delivered: 'Доставлен', cancelled: 'Отменён',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                StyleTech Shop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Панель управления</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
                {admin.first_name}
              </p>
              <p className="text-xs mt-0.5">
                <span className={`inline-block px-2 py-0.5 rounded-full font-medium ${
                  admin.role === 'admin'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : admin.role === 'manager'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}>
                  {ROLE_LABELS[admin.role]}
                </span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Всего заказов</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {loading ? '—' : stats.totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Выручка</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {loading ? '—' : formatPrice(stats.totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Товары</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {loading ? '—' : stats.totalProducts}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-3">
            <Link
              to="/admin/products"
              className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition group"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition">
                <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">Товары</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Добавить, редактировать</p>
              </div>
            </Link>

            {canManageOrders(admin) && (
              <Link
                to="/admin/orders"
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition group"
              >
                <div className="w-11 h-11 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition">
                  <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Заказы</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Просмотр и статусы</p>
                </div>
              </Link>
            )}

            {canManageUsers(admin) && (
              <Link
                to="/admin/users"
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-md transition group"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition">
                  <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">Пользователи</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Роли и доступы</p>
                </div>
              </Link>
            )}
          </div>

          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-semibold text-gray-900 dark:text-white">Последние заказы</h2>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : stats.recentOrders.length === 0 ? (
              <div className="py-16 text-center text-gray-400 dark:text-gray-500 text-sm">
                Заказов пока нет
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] ?? statusColors.new}`}>
                        {statusLabels[order.status] ?? order.status}
                      </span>
                      <p className="text-sm font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {formatPrice(Number(order.total_amount))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
