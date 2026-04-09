import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard as Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentAdmin, AdminRole, ROLE_LABELS } from '../../lib/auth';

interface DbUser {
  id: string;
  telegram_id: number;
  first_name: string;
  username: string | null;
  role: string;
  created_at: string;
}

const ROLES: AdminRole[] = ['admin', 'manager', 'seller'];

export const AdminUsers = () => {
  const admin = getCurrentAdmin();
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbUser | null>(null);
  const [form, setForm] = useState({ first_name: '', username: '', role: 'seller' as AdminRole });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('users').select('*').order('created_at', { ascending: false });
      if (err) throw err;
      setUsers(data ?? []);
    } catch {
      setError('Не удалось загрузить пользователей.');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ first_name: '', username: '', role: 'seller' });
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (u: DbUser) => {
    setEditing(u);
    setForm({ first_name: u.first_name, username: u.username ?? '', role: (u.role as AdminRole) });
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.first_name.trim()) { setFormError('Введите имя'); return; }

    setSaving(true);
    try {
      if (editing) {
        const { error: err } = await supabase.from('users').update({
          first_name: form.first_name.trim(),
          username: form.username.trim() || null,
          role: form.role,
        }).eq('id', editing.id);
        if (err) throw err;
        setSuccess('Пользователь обновлён');
      } else {
        const fakeId = Date.now();
        const { error: err } = await supabase.from('users').insert({
          telegram_id: fakeId,
          first_name: form.first_name.trim(),
          username: form.username.trim() || null,
          role: form.role,
          language: 'ru',
        });
        if (err) throw err;
        setSuccess('Пользователь создан');
      }
      closeForm();
      await loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setFormError(err.message ?? 'Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить пользователя? Действие необратимо.')) return;
    const { error: err } = await supabase.from('users').delete().eq('id', id);
    if (err) { setError('Ошибка при удалении.'); return; }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSuccess('Пользователь удалён');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!admin) return null;

  const roleCls: Record<string, string> = {
    admin:   'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    manager: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    seller:  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
    user:    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Пользователи</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить</span>
          </button>
        </div>
      </header>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editing ? 'Редактировать пользователя' : 'Новый пользователь'}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Имя
                </label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="Иван Петров"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  placeholder="ivan_petrov"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Роль
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value as AdminRole })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                  {form.role === 'admin' && 'Полный доступ ко всем разделам'}
                  {form.role === 'manager' && 'Доступ: товары, заказы, аналитика'}
                  {form.role === 'seller' && 'Доступ: только управление товарами'}
                </p>
              </div>

              {formError && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 dark:text-red-400">{formError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-60 text-sm"
                >
                  {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                  {editing ? 'Сохранить' : 'Создать'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2.5 rounded-xl transition text-sm"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {success && (
          <div className="mb-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500 text-sm">
            Нет пользователей
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Имя</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Username</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Роль</th>
                  <th className="text-left px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Добавлен</th>
                  <th className="text-right px-6 py-3 font-semibold text-gray-700 dark:text-gray-300">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                      {u.first_name}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {u.username ? `@${u.username}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleCls[u.role] ?? roleCls.user}`}>
                        {ROLE_LABELS[u.role as AdminRole] ?? u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">
                      {new Date(u.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                          title="Редактировать"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};
