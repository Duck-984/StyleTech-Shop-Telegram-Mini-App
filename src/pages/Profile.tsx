import { useNavigate } from 'react-router-dom';
import { User, Globe, Shield } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { getTelegramUser } from '../lib/telegram';

export const Profile = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const setLanguage = useAppStore((state) => state.setLanguage);
  const user = getTelegramUser();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.first_name || 'Guest'}
              </h2>
              {user?.username && (
                <p className="text-gray-600 dark:text-gray-400">@{user.username}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-4">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">{t('change_language')}</span>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {language === 'ru' ? '🇷🇺 Русский' : '🇺🇿 O\'zbekcha'}
            </span>
          </button>

          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-900 dark:text-white">{t('admin_panel')}</span>
            </div>
          </button>
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>StyleTech Shop v1.0</p>
          <p className="mt-1">Telegram Mini App</p>
        </div>
      </div>
    </Layout>
  );
};
