export type AdminRole = 'admin' | 'manager' | 'seller';

export interface AdminUser {
  id: string;
  first_name: string;
  email: string;
  role: AdminRole;
}

const STORAGE_KEY = 'styletech_admin';

const CREDENTIALS: Record<string, { password: string; user: AdminUser }> = {
  'admin@shop.uz': {
    password: 'Admin123',
    user: {
      id: 'admin-001',
      first_name: 'Администратор',
      email: 'admin@shop.uz',
      role: 'admin',
    },
  },
};

export function loginAdmin(email: string, password: string): AdminUser | null {
  const entry = CREDENTIALS[email.trim().toLowerCase()];
  if (!entry || entry.password !== password) {
    return null;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entry.user));
  return entry.user;
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
