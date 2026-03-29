import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  productQueries,
  categoryQueries,
  orderQueries,
  reviewQueries,
  promotionQueries,
  referralQueries,
  paymentQueries,
} from './queries';
import type { Database } from '../supabase';

// Products
export const useProducts = (filters?: any, sort?: any) => {
  return useQuery({
    queryKey: ['products', filters, sort],
    queryFn: () => productQueries.getAll(filters, sort),
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productQueries.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useIncrementViews = () => {
  return useMutation({
    mutationFn: (productId: string) => productQueries.incrementViews(productId),
  });
};

export const useUploadProductImages = () => {
  return useMutation({
    mutationFn: (files: File[]) => productQueries.uploadImages(files),
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryQueries.getAll(),
  });
};

// Orders
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: Database['public']['Tables']['orders']['Insert']) =>
      orderQueries.create(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useOrders = (telegramUserId: number) => {
  return useQuery({
    queryKey: ['orders', telegramUserId],
    queryFn: () => orderQueries.getByTelegramUserId(telegramUserId),
    enabled: !!telegramUserId,
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderQueries.getById(orderId),
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderQueries.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Reviews
export const useProductReviews = (productId: string) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewQueries.getByProductId(productId),
    enabled: !!productId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewData: Database['public']['Tables']['reviews']['Insert']) =>
      reviewQueries.create(reviewData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', data.product_id] });
    },
  });
};

export const useProductRating = (productId: string) => {
  return useQuery({
    queryKey: ['rating', productId],
    queryFn: () => reviewQueries.getAverageRating(productId),
    enabled: !!productId,
  });
};

// Promotions
export const usePromotions = (type?: 'new_arrival' | 'sale' | 'featured') => {
  return useQuery({
    queryKey: ['promotions', type],
    queryFn: () => promotionQueries.getActive(type),
  });
};

export const usePromotionProducts = (promotionId: string) => {
  return useQuery({
    queryKey: ['promotion-products', promotionId],
    queryFn: () => promotionQueries.getProductsByPromotion(promotionId),
    enabled: !!promotionId,
  });
};

// Referrals
export const useReferralByCode = (code: string) => {
  return useQuery({
    queryKey: ['referral', code],
    queryFn: () => referralQueries.getByCode(code),
    enabled: !!code,
  });
};

export const useCreateReferral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (telegramId: number) => referralQueries.create(telegramId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
    },
  });
};

export const useUserReferrals = (telegramId: number) => {
  return useQuery({
    queryKey: ['referrals', telegramId],
    queryFn: () => referralQueries.getByReferrer(telegramId),
    enabled: !!telegramId,
  });
};

export const useRedeemReferral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ referralId, telegramId }: { referralId: string; telegramId: number }) =>
      referralQueries.redeem(referralId, telegramId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
    },
  });
};

// Payments
export const useCreatePayment = () => {
  return useMutation({
    mutationFn: ({ orderId, amount, paymentMethod }: {
      orderId: string;
      amount: number;
      paymentMethod: 'payme' | 'click' | 'uzum';
    }) => paymentQueries.createPayment(orderId, amount, paymentMethod),
  });
};
