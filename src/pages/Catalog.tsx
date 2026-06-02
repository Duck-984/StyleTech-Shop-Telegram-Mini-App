import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { BannerSlider } from '../components/BannerSlider';
import { useTranslation } from '../hooks/useTranslation';
import { useProducts, useCategories, useBanners } from '../lib/supabase/hooks';
import { getLocalizedValue } from '../lib/utils';

export const Catalog = () => {
  const { t, language } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'created_at' | 'price' | 'views'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  const { data: categories = [] } = useCategories();
  const { data: banners = [] } = useBanners(true);

  const filters = {
    categoryId: selectedCategory,
    minPrice,
    maxPrice,
    sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
    colors: selectedColors.length > 0 ? selectedColors : undefined,
    inStock: inStockOnly,
    search: searchQuery || undefined,
  };

  const sort = {
    field: sortBy,
    order: sortOrder,
  };

  const { data: products = [], isLoading } = useProducts(filters, sort);

  const allSizes = Array.from(
    new Set(
      products.flatMap((p) => p.sizes)
    )
  ).sort();

  const allColors = Array.from(
    new Map(
      products
        .flatMap((p) => p.colors)
        .map((c: any) => [c.hex, c])
    ).values()
  );

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (hex: string) => {
    setSelectedColors((prev) =>
      prev.includes(hex) ? prev.filter((c) => c !== hex) : [...prev, hex]
    );
  };

  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSearchQuery('');
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSelectedSizes([]);
    setSelectedColors([]);
    setInStockOnly(false);
  };

  const activeFiltersCount =
    (selectedCategory ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (inStockOnly ? 1 : 0);

  return (
    <Layout>
      {banners.length > 0 && (
        <BannerSlider banners={banners} language={language} />
      )}

      <div className="px-3 pt-3 pb-2">
        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Categories scroll */}
        <div className="overflow-x-auto scrollbar-hide -mx-3 px-3 mb-3">
          <div className="flex gap-2 pb-1">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {t('all_products')}
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap text-xs font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {getLocalizedValue(category.name, language)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {products.length} {language === 'ru' ? 'товаров' : 'mahsulot'}
          </span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs"
          >
            <option value="created_at-desc">{t('newest')}</option>
            <option value="price-asc">{t('price_low')}</option>
            <option value="price-desc">{t('price_high')}</option>
            <option value="views-desc">{t('popularity')}</option>
          </select>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mx-3 mb-3 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white">{t('filters')}</h3>
            <div className="flex items-center gap-3">
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-blue-500 font-medium">
                  {t('reset')}
                </button>
              )}
              <button onClick={() => setShowFilters(false)} className="p-1">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                {t('price_from')} - {t('price_to')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <span className="text-gray-400 text-sm">—</span>
                <input
                  type="number"
                  placeholder="∞"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>

            {allSizes.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t('size')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                        selectedSizes.includes(size)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {allColors.length > 0 && (
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {t('color')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((color: any) => (
                    <button
                      key={color.hex}
                      onClick={() => toggleColor(color.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        selectedColors.includes(color.hex)
                          ? 'border-blue-500 scale-110 ring-2 ring-blue-200'
                          : 'border-gray-200 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300">{t('in_stock')}</span>
            </label>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="px-3 pb-20">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block w-7 h-7 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-xs mt-3">{t('loading')}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">
              {searchQuery || activeFiltersCount > 0
                ? language === 'ru' ? 'Товары не найдены' : 'Mahsulotlar topilmadi'
                : language === 'ru' ? 'Нет товаров' : 'Mahsulotlar yo\'q'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
