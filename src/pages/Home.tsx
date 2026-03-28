import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getTelegramUser } from '../lib/telegram';
import { ShoppingBag } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { language, setLanguage, setTelegramUserId } = useAppStore();

  useEffect(() => {
    const user = getTelegramUser();
    if (user) {
      setTelegramUserId(user.id);
      const langCode = user.language_code;
      if (langCode === 'uz' || langCode === 'ru') {
        setLanguage(langCode);
      }
    }
  }, [setLanguage, setTelegramUserId]);

  const handleLanguageSelect = (lang: 'ru' | 'uz') => {
    setLanguage(lang);
    navigate('/catalog');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <ShoppingBag className="w-20 h-20 text-white mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">StyleTech Shop</h1>
        <p className="text-blue-100">
          {language === 'ru' ? 'Выберите язык' : 'Tilni tanlang'}
        </p>
      </div>

      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={() => handleLanguageSelect('ru')}
          className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          🇷🇺 Русский
        </button>

        <button
          onClick={() => handleLanguageSelect('uz')}
          className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          🇺🇿 O'zbekcha
        </button>
      </div>
    </div>
  );
};
