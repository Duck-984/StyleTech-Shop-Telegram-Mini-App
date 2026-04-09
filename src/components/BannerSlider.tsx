import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Banner } from '../lib/supabase/queries';

interface Props {
  banners: Banner[];
  language: 'ru' | 'uz';
}

export const BannerSlider = ({ banners, language }: Props) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 400);
  };

  const prev = () => goTo((current - 1 + banners.length) % banners.length);
  const next = () => goTo((current + 1) % banners.length);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [banners.length]);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 4000);
  };

  if (!banners.length) return null;

  const banner = banners[current];

  const handleCta = () => {
    if (banner.link_url) {
      if (banner.link_url.startsWith('/')) {
        navigate(banner.link_url);
      } else {
        window.open(banner.link_url, '_blank');
      }
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mx-4 shadow-xl">
      <div
        className={`relative h-44 bg-gradient-to-r ${banner.bg_color} transition-all duration-400`}
        style={{ transition: 'background 0.4s ease' }}
      >
        {banner.image_url && (
          <img
            src={banner.image_url}
            alt={banner.title[language] || banner.title.ru}
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
            style={{ transition: 'opacity 0.4s ease' }}
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-5 pb-2">
          <p
            className="text-white font-bold text-xl leading-tight drop-shadow-sm"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
          >
            {banner.title[language] || banner.title.ru}
          </p>
          <p className="text-white/85 text-sm mt-1.5 leading-snug max-w-[70%]">
            {banner.subtitle[language] || banner.subtitle.ru}
          </p>
          {banner.link_url && banner.link_label && (
            <button
              onClick={handleCta}
              className="mt-3 self-start px-4 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs font-semibold transition-all active:scale-95"
            >
              {banner.link_label[language] || banner.link_label.ru}
            </button>
          )}
        </div>

        {banners.length > 1 && (
          <>
            <button
              onClick={() => { prev(); resetTimer(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={() => { next(); resetTimer(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </>
        )}
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => { goTo(i); resetTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-5 h-1.5 bg-white'
                  : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
