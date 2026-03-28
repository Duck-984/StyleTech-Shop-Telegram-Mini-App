import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useTranslation } from '../hooks/useTranslation';
import { useCartStore } from '../store/useCartStore';
import { supabase, Database } from '../lib/supabase';
import { formatPrice, getLocalizedValue } from '../lib/utils';
import { hapticNotification } from '../lib/telegram';

type Product = Database['public']['Tables']['products']['Row'];

export const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | undefined>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
      if (data.colors && data.colors.length > 0) {
        setSelectedColor(data.colors[0] as { name: string; hex: string });
      }
      await supabase
        .from('products')
        .update({ views: data.views + 1 })
        .eq('id', data.id);
    }
    setLoading(false);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes.length > 0 && !selectedSize) {
      alert(t('select_size'));
      return;
    }

    if (product.colors.length > 0 && !selectedColor) {
      alert(t('select_color'));
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    hapticNotification('success');
    navigate('/cart');
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{t('loading')}</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Товар не найден</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-900">
        <div className="relative">
          {product.images.length > 0 ? (
            <div className="aspect-square bg-gray-100 dark:bg-gray-800">
              <img
                src={product.images[currentImageIndex]}
                alt={getLocalizedValue(product.name, language)}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? 'bg-white'
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {getLocalizedValue(product.name, language)}
          </h1>

          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {formatPrice(product.price)}
          </p>

          {product.sizes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('select_size')}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedSize === size
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('select_color')}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => {
                  const col = color as { name: string; hex: string };
                  return (
                    <button
                      key={col.hex}
                      onClick={() => setSelectedColor(col)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor?.hex === col.hex
                          ? 'border-blue-500 scale-110'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: col.hex }}
                      title={col.name}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('quantity')}
            </p>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t('description')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {getLocalizedValue(product.description, language)}
            </p>
          </div>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('specifications')}
              </h2>
              <div className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">{key}</span>
                    <span className="text-gray-900 dark:text-white font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-blue-600 transition-colors disabled:bg-gray-400"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{product.stock === 0 ? t('out_of_stock') : t('add_to_cart')}</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};
