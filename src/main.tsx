import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { getTelegramUser, readyApp, expandApp } from './lib/telegram';
import { useAppStore } from './store/useAppStore';
import { userQueries } from './lib/supabase/hooks';

// Initialize Telegram WebApp
readyApp();
expandApp();

// Register user on app start
const tgUser = getTelegramUser();
if (tgUser?.id) {
  useAppStore.getState().setTelegramUserId(tgUser.id);
  // Upsert user record in background
  userQueries.upsert(tgUser.id, {
    first_name: tgUser.first_name || '',
    username: tgUser.username || null,
    language: tgUser.language_code || 'ru',
  }).catch(() => {});
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
