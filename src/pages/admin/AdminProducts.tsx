import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, CreditCard as Edit, Trash2, ArrowLeft } from 'lucide-react';
import { supabase, Database } from '../../lib/supabase';
import { formatPrice } from '../../lib/utils';

type Product = Database['public']['Tables']['products']['Row'];

export const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (!error) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('products')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      setProducts(
        products.map((p) => (p.id === id ? { ...p, is_active: !currentStatus } : p))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Товары
              </h1>
            </div>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить товар</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">Нет товаров</p>
            <button
              onClick={() => navigate('/admin/products/new')}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              Добавить первый товар
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Товар
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Склад
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name.ru}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {product.name.ru}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product.id, product.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {product.is_active ? 'Активен' : 'Скрыт'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
