import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getTelegramUser } from '../lib/telegram';
import { ShoppingBag, Gift, Star } from 'lucide-react';
import { useCreateReferral, useUserReferrals, useBanners } from '../lib/supabase/hooks';
import { BannerSlider } from '../components/BannerSlider';

export const Home = () => {
  const navigate = useNavigate();
  const { language, setLanguage, setTelegramUserId } = useAppStore();
  const [showReferral, setShowReferral] = useState(false);

  const { data: banners = [] } = useBanners(true);
  const createReferral = useCreateReferral();
  const user = getTelegramUser();
  const { data: userReferrals = [] } = useUserReferrals(user?.id || 0);

  useEffect(() => {
    if (user) {
      setTelegramUserId(user.id);
      const langCode = user.language_code;
      if (langCode === 'uz' || langCode === 'ru') {
        setLanguage(langCode);
      }

      if (userReferrals.length === 0) {
        createReferral.mutate(user.id);
      }
    }
  }, [user?.id, userReferrals.length]);

  const handleLanguageSelect = (lang: 'ru' | 'uz') => {
    setLanguage(lang);
    navigate('/catalog');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="text-center pt-10 pb-5 px-4">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-3 mb-3">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">StyleTech Shop</h1>
        <p className="text-blue-300 text-sm mt-1">
          {language === 'ru' ? 'Выберите язык' : 'Tilni tanlang'}
        </p>
      </div>

      {banners.length > 0 && (
        <div className="mb-6">
          <BannerSlider banners={banners} language={language} />
        </div>
      )}

      <div className="px-4 space-y-3 max-w-sm mx-auto">
        <button
          onClick={() => handleLanguageSelect('ru')}
          className="w-full bg-white text-gray-900 py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-gray-50 active:scale-[0.98] transition-all shadow-lg"
        >
          🇷🇺 Русский
        </button>

        <button
          onClick={() => handleLanguageSelect('uz')}
          className="w-full bg-white text-gray-900 py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-gray-50 active:scale-[0.98] transition-all shadow-lg"
        >
          🇺🇿 O'zbekcha
        </button>
      </div>

      {user && userReferrals.length > 0 && (
        <div className="px-4 mt-5 max-w-sm mx-auto">
          <button
            onClick={() => setShowReferral(!showReferral)}
            className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-4 rounded-2xl font-medium hover:bg-white/15 transition-colors flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5" />
            <span>
              {language === 'ru' ? 'Пригласи друга' : "Do'stingni taklif qil"}
            </span>
          </button>

          {showReferral && (
            <div className="mt-3 bg-white rounded-2xl p-4 shadow-xl">
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'ru' ? 'Ваша реферальная ссылка' : 'Sizning referal havolangiz'}
              </h3>
              <div className="bg-gray-100 rounded-xl p-3 mb-2">
                <code className="text-sm text-gray-800 break-all">
                  {userReferrals[0].referral_code}
                </code>
              </div>
              <p className="text-sm text-gray-600">
                {language === 'ru'
                  ? `Получите ${userReferrals[0].bonus_amount.toLocaleString()} сум за каждого друга!`
                  : `Har bir do'st uchun ${userReferrals[0].bonus_amount.toLocaleString()} so'm oling!`}
              </p>
              {userReferrals[0].is_redeemed && (
                <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  <span>{language === 'ru' ? 'Использован!' : 'Ishlatildi!'}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-10 pb-8 px-4">
        <p className="text-blue-400/70 text-xs">
          {language === 'ru'
            ? 'Telegram Mini App для Узбекистана'
            : "O'zbekiston uchun Telegram Mini App"}
        </p>
      </div>
    </div>
  );
};
