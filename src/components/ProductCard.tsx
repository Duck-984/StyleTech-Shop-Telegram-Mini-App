import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { formatPrice, getLocalizedValue } from '../lib/utils';
import { Database } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { language, t } = useTranslation();

  return (
    <Link
      to={`/product/${product.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all active:scale-[0.97]"
    >
      <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
        {product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={getLocalizedValue(product.name, language)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            {t('no_image')}
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-xs px-3 py-1 bg-black/60 rounded-full">
              {t('out_of_stock')}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent pt-8 pb-2 px-2">
          <span className="text-white font-bold text-sm drop-shadow-sm">
            {formatPrice(product.price)}
          </span>
        </div>

        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {language === 'ru' ? 'Осталось' : 'Qoldi'} {product.stock}
          </div>
        )}
      </div>

      <div className="p-2.5">
        <h3 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight">
          {getLocalizedValue(product.name, language)}
        </h3>
      </div>
    </Link>
  );
};
