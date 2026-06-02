import { compare } from 'bcryptjs';
import { supabase } from './supabase';

export type AdminRole = 'admin' | 'manager' | 'seller';

export interface AdminUser {
  id: string;
  first_name: string;
  email: string;
  role: AdminRole;
}

const STORAGE_KEY = 'styletech_admin';

export async function loginAdmin(email: string, password: string): Promise<AdminUser | null> {
  const emailLower = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from('admin_accounts')
    .select('id, email, first_name, role, is_active, password_hash, password_plain')
    .eq('email', emailLower)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;

  let passwordMatch = false;

  if (data.password_hash) {
    passwordMatch = await compare(password, data.password_hash);
  } else if (data.password_plain) {
    passwordMatch = password === data.password_plain;
  }

  if (!passwordMatch) return null;

  const user: AdminUser = {
    id: data.id,
    first_name: data.first_name,
    email: data.email,
    role: data.role as AdminRole,
  };

  await supabase
    .from('admin_accounts')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', data.id);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function getCurrentAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AdminUser) : null;
  } catch {
    return null;
  }
}

export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function canManageUsers(user: AdminUser | null): boolean {
  return user?.role === 'admin';
}

export function canManageOrders(user: AdminUser | null): boolean {
  return user?.role === 'admin' || user?.role === 'manager';
}

export function canManageProducts(user: AdminUser | null): boolean {
  return !!user;
}

export function canManageBanners(user: AdminUser | null): boolean {
  return user?.role === 'admin' || user?.role === 'manager';
}

export function canManageDelivery(user: AdminUser | null): boolean {
  return user?.role === 'admin' || user?.role === 'manager';
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  seller: 'Продавец',
};
