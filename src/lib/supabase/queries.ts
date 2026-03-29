import { supabase, Database } from '../supabase';

export type Product = Database['public']['Tables']['products']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Promotion = Database['public']['Tables']['promotions']['Row'];
export type Referral = Database['public']['Tables']['referrals']['Row'];

interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  inStock?: boolean;
  search?: string;
}

interface ProductSort {
  field: 'created_at' | 'price' | 'views';
  order: 'asc' | 'desc';
}

export const productQueries = {
  getAll: async (filters?: ProductFilters, sort?: ProductSort) => {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    if (filters?.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters?.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters?.search) {
      query = query.or(`name->ru.ilike.%${filters.search}%,name->uz.ilike.%${filters.search}%,description->ru.ilike.%${filters.search}%,description->uz.ilike.%${filters.search}%`);
    }

    if (filters?.inStock) {
      query = query.gt('stock', 0);
    }

    if (sort) {
      query = query.order(sort.field, { ascending: sort.order === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) throw error;

    // Client-side filtering for arrays
    let filteredData = data || [];

    if (filters?.sizes && filters.sizes.length > 0) {
      filteredData = filteredData.filter(product =>
        product.sizes.some((size: string) => filters.sizes!.includes(size))
      );
    }

    if (filters?.colors && filters.colors.length > 0) {
      filteredData = filteredData.filter(product =>
        product.colors.some((color: any) => filters.colors!.includes(color.hex))
      );
    }

    return filteredData;
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  incrementViews: async (id: string) => {
    const { data: product } = await supabase
      .from('products')
      .select('views')
      .eq('id', id)
      .single();

    if (product) {
      await supabase
        .from('products')
        .update({ views: (product.views || 0) + 1 })
        .eq('id', id);
    }
  },

  uploadImages: async (files: File[]) => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  },
};

export const categoryQueries = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name->ru');

    if (error) throw error;
    return data;
  },
};

export const orderQueries = {
  create: async (orderData: Database['public']['Tables']['orders']['Insert']) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getByTelegramUserId: async (telegramUserId: number) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('telegram_user_id', telegramUserId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToOrders: (callback: (payload: any) => void) => {
    return supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        callback
      )
      .subscribe();
  },
};

export const reviewQueries = {
  getByProductId: async (productId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (reviewData: Database['public']['Tables']['reviews']['Insert']) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getAverageRating: async (productId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)
      .eq('is_approved', true);

    if (error) throw error;

    if (!data || data.length === 0) return { average: 0, count: 0 };

    const sum = data.reduce((acc, review) => acc + review.rating, 0);
    return {
      average: sum / data.length,
      count: data.length,
    };
  },
};

export const promotionQueries = {
  getActive: async (type?: 'new_arrival' | 'sale' | 'featured') => {
    let query = supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .lte('starts_at', new Date().toISOString())
      .or(`ends_at.is.null,ends_at.gte.${new Date().toISOString()}`);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  },

  getProductsByPromotion: async (promotionId: string) => {
    const { data: promotion } = await supabase
      .from('promotions')
      .select('product_ids')
      .eq('id', promotionId)
      .single();

    if (!promotion || !promotion.product_ids?.length) return [];

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', promotion.product_ids)
      .eq('is_active', true);

    if (error) throw error;
    return data;
  },
};

export const referralQueries = {
  getByCode: async (code: string) => {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referral_code', code)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  create: async (telegramId: number) => {
    const code = `REF${telegramId}${Math.random().toString(36).substring(7).toUpperCase()}`;

    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referrer_telegram_id: telegramId,
        referral_code: code,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getByReferrer: async (telegramId: number) => {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_telegram_id', telegramId);

    if (error) throw error;
    return data;
  },

  redeem: async (referralId: string, referredTelegramId: number) => {
    const { data, error } = await supabase
      .from('referrals')
      .update({
        referred_telegram_id: referredTelegramId,
        is_redeemed: true,
        redeemed_at: new Date().toISOString(),
      })
      .eq('id', referralId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

export const paymentQueries = {
  createPayment: async (orderId: string, amount: number, paymentMethod: 'payme' | 'click' | 'uzum') => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/create-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, amount, paymentMethod }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment');
    }

    return response.json();
  },
};
