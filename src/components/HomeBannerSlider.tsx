import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Banner } from '../lib/supabase/queries';

interface Props {
  banners: Banner[];
  language: 'ru' | 'uz';
  onNavigate: () => void;
}

const AUTOPLAY_DELAY = 5000;

export const HomeBannerSlider = ({ banners, language, onNavigate }: Props) => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % banners.length) + banners.length) % banners.length);
    },
    [banners.length],
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, AUTOPLAY_DELAY);
  }, [banners.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      goTo(dx < 0 ? current + 1 : current - 1);
      startTimer();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  if (!banners.length) return null;

  const banner = banners[current];

  const handleCta = () => {
    if (banner.link_url) {
      onNavigate();
    }
  };

  return (
    <div
      className="relative overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative h-44 sm:h-52">
        {banners.map((b, i) => (
          <div
            key={b.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${b.bg_color}`} />

            {b.image_url && (
              <img
                src={b.image_url}
                alt={b.title[language] || b.title.ru}
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end px-5 pb-5">
              {b.subtitle && (b.subtitle.ru || b.subtitle.uz) && (
                <p className="text-white/75 text-xs font-medium uppercase tracking-widest mb-1.5 drop-shadow-sm">
                  {b.subtitle[language] || b.subtitle.ru}
                </p>
              )}
              <p
                className="text-white font-bold text-xl leading-tight drop-shadow-md max-w-[75%]"
                style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
              >
                {b.title[language] || b.title.ru}
              </p>
              {(b.link_url || b.link_label) && (
                <button
                  onClick={handleCta}
                  className="mt-3 self-start flex items-center gap-1.5 px-4 py-1.5 bg-white text-gray-900 rounded-full text-xs font-bold hover:bg-white/90 active:scale-95 transition-all shadow-lg"
                >
                  {b.link_label ? (b.link_label[language] || b.link_label.ru) : (language === 'ru' ? 'Смотреть' : "Ko'rish")}
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 right-4 z-20 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); startTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/45 hover:bg-white/65'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
