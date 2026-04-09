export type AdminRole = 'admin' | 'manager' | 'seller';

export interface AdminUser {
  id: string;
  first_name: string;
  email: string;
  role: AdminRole;
}

const STORAGE_KEY = 'styletech_admin';

export function loginAdmin(email: string, password: string): AdminUser | null {
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) return null;
  if (email.trim().toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return null;
  }

  const user: AdminUser = {
    id: 'admin-001',
    first_name: 'Администратор',
    email: adminEmail,
    role: 'admin',
  };

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
