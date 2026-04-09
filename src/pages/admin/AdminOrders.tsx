import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { supabase, Database } from '../../lib/supabase';
import { getCurrentAdmin, ROLE_LABELS } from '../../lib/auth';
import { formatPrice } from '../../lib/utils';

type Order = Database['public']['Tables']['orders']['Row'];

const STATUS_OPTIONS = [
  { value: 'new',        label: 'Новый',         cls: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
  { value: 'processing', label: 'В обработке',    cls: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  { value: 'paid',       label: 'Оплачен',        cls: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  { value: 'shipped',    label: 'Отправлен',      cls: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  { value: 'delivered',  label: 'Доставлен',      cls: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
  { value: 'cancelled',  label: 'Отменён',        cls: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
];

const getStatusInfo = (value: string) =>
  STATUS_OPTIONS.find((s) => s.value === value) ?? STATUS_OPTIONS[0];

export const AdminOrders = () => {
  const navigate = useNavigate();
  const admin = getCurrentAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();

    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, loadOrders)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setOrders(data ?? []);
    } catch {
      setError('Не удалось загрузить заказы.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { error: err } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (err) { setError('Ошибка при обновлении статуса.'); return; }
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Заказы</h1>
          </div>

          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-none">
              {admin.first_name}
            </p>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              admin.role === 'admin'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
            }`}>
              {ROLE_LABELS[admin.role]}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 text-sm">
            Заказов пока нет
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status ?? 'new');
              const expanded = expandedId === order.id;
              const info = order.customer_info as any;

              return (
                <div
                  key={order.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
                >
                  <div className="px-5 py-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {new Date(order.created_at).toLocaleDateString('ru-RU', {
                                day: 'numeric', month: 'short', year: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(Number(order.total_amount))}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            value={order.status ?? 'new'}
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 ${statusInfo.cls}`}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>

                          {order.payment_method && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                              {order.payment_method}
                            </span>
                          )}
                          {order.delivery_type && (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 font-medium">
                              {order.delivery_type}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedId(expanded ? null : order.id)}
                        className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition flex-shrink-0"
                      >
                        <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4 bg-gray-50/50 dark:bg-gray-700/20 space-y-4">
                      {info && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Покупатель
                          </p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            {info.name && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Имя</p>
                                <p className="font-medium text-gray-900 dark:text-white">{info.name}</p>
                              </div>
                            )}
                            {info.phone && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Телефон</p>
                                <p className="font-medium text-gray-900 dark:text-white">{info.phone}</p>
                              </div>
                            )}
                            {info.city && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Город</p>
                                <p className="font-medium text-gray-900 dark:text-white">{info.city}</p>
                              </div>
                            )}
                            {info.address && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Адрес</p>
                                <p className="font-medium text-gray-900 dark:text-white">{info.address}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {Array.isArray(order.items) && order.items.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                            Товары
                          </p>
                          <div className="space-y-1.5">
                            {(order.items as any[]).map((item: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-700 dark:text-gray-300">
                                  {item.name?.ru ?? item.name ?? '—'}
                                  {item.size && <span className="text-gray-500"> / {item.size}</span>}
                                  {item.color && <span className="text-gray-500"> / {item.color?.name ?? item.color}</span>}
                                  {' '}× {item.quantity}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                  {formatPrice(Number(item.price) * Number(item.quantity))}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {Number(order.delivery_cost) > 0 && (
                        <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-600">
                          <span className="text-gray-500 dark:text-gray-400">Доставка</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatPrice(Number(order.delivery_cost))}
                          </span>
                        </div>
                      )}

                      {order.notes && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                            Примечание
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
