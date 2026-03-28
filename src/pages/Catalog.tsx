import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { useTranslation } from '../hooks/useTranslation';
import { supabase, Database } from '../lib/supabase';
import { getLocalizedValue } from '../lib/utils';

type Product = Database['public']['Tables']['products']['Row'];
type Category = Database['public']['Tables']['categories']['Row'];

export const Catalog = () => {
  const { t, language } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (data) {
      setCategories(data);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data } = await query.order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const filteredProducts = products.filter((product) => {
    const name = getLocalizedValue(product.name, language).toLowerCase();
    const description = getLocalizedValue(product.description, language).toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || description.includes(query);
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="mb-4 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('all_products')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {getLocalizedValue(category.name, language)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Товары не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
