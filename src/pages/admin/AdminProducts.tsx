import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, CreditCard as Edit2, Trash2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase, Database } from '../../lib/supabase';
import { getCurrentAdmin, ROLE_LABELS, logoutAdmin } from '../../lib/auth';
import { formatPrice } from '../../lib/utils';

type Product = Database['public']['Tables']['products']['Row'];

export const AdminProducts = () => {
  const navigate = useNavigate();
  const admin = getCurrentAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (err) throw err;
      setProducts(data ?? []);
    } catch {
      setError('Не удалось загрузить список товаров.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот товар? Действие необратимо.')) return;
    const { error: err } = await supabase.from('products').delete().eq('id', id);
    if (err) { setError('Ошибка при удалении товара.'); return; }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleActive = async (id: string, current: boolean) => {
    const { error: err } = await supabase
      .from('products').update({ is_active: !current }).eq('id', id);
    if (err) { setError('Ошибка при изменении статуса.'); return; }
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !current } : p));
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
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Товары</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
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
              onClick={() => navigate('/admin/products/new')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить</span>
            </button>
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
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Товаров пока нет</p>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Добавить первый товар
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Товар</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Цена</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Склад</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Статус</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              нет
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {(product.name as any)?.ru ?? '—'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {formatPrice(Number(product.price))}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product.id, product.is_active ?? true)}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                          product.is_active
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {product.is_active
                          ? <><Eye className="w-3.5 h-3.5" /> Активен</>
                          : <><EyeOff className="w-3.5 h-3.5" /> Скрыт</>
                        }
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
