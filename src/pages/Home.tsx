import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getTelegramUser } from '../lib/telegram';
import { ShoppingBag, Gift, Star, Zap } from 'lucide-react';
import { usePromotions, useCreateReferral, useUserReferrals } from '../lib/supabase/hooks';

export const Home = () => {
  const navigate = useNavigate();
  const { language, setLanguage, setTelegramUserId } = useAppStore();
  const [showReferral, setShowReferral] = useState(false);

  const { data: promotions = [] } = usePromotions();
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

      // Auto-create referral code if user doesn't have one
      if (userReferrals.length === 0) {
        createReferral.mutate(user.id);
      }
    }
  }, [user?.id, userReferrals.length]);

  const handleLanguageSelect = (lang: 'ru' | 'uz') => {
    setLanguage(lang);
    navigate('/catalog');
  };

  const hasPromotions = promotions.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600">
      {/* Header */}
      <div className="text-center pt-12 pb-6 px-4">
        <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
          <ShoppingBag className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">StyleTech Shop</h1>
        <p className="text-blue-100">
          {language === 'ru' ? 'Выберите язык' : 'Tilni tanlang'}
        </p>
      </div>

      {/* Promotions Preview */}
      {hasPromotions && (
        <div className="px-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-white">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold">
                {language === 'ru' ? 'Специальные предложения!' : 'Maxsus takliflar!'}
              </span>
            </div>
            <div className="space-y-2">
              {promotions.slice(0, 2).map((promo) => (
                <div key={promo.id} className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-300 flex-shrink-0" />
                  <span className="text-sm">
                    {promo.title[language] || promo.title.ru}
                    {promo.discount_percentage > 0 && ` (-${promo.discount_percentage}%)`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Language Selection */}
      <div className="px-4 space-y-4 max-w-sm mx-auto">
        <button
          onClick={() => handleLanguageSelect('ru')}
          className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
        >
          🇷🇺 Русский
        </button>

        <button
          onClick={() => handleLanguageSelect('uz')}
          className="w-full bg-white text-gray-900 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
        >
          🇺🇿 O'zbekcha
        </button>
      </div>

      {/* Referral Section */}
      {user && userReferrals.length > 0 && (
        <div className="px-4 mt-6 max-w-sm mx-auto">
          <button
            onClick={() => setShowReferral(!showReferral)}
            className="w-full bg-white/10 backdrop-blur-sm text-white py-3 px-4 rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
          >
            <Gift className="w-5 h-5" />
            <span>
              {language === 'ru' ? 'Пригласи друга' : 'Do\'stingni taklif qil'}
            </span>
          </button>

          {showReferral && (
            <div className="mt-3 bg-white rounded-xl p-4 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'ru' ? 'Ваша реферальная ссылка' : 'Sizning referal havolangiz'}
              </h3>
              <div className="bg-gray-100 rounded-lg p-3 mb-2">
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
                <div className="mt-2 text-xs text-green-600 flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>
                    {language === 'ru' ? 'Использован!' : 'Ishlatildi!'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="text-center mt-12 pb-8 px-4">
        <p className="text-blue-100 text-sm">
          {language === 'ru'
            ? 'Telegram Mini App для Узбекистана'
            : 'O\'zbekiston uchun Telegram Mini App'}
        </p>
      </div>
    </div>
  );
};
