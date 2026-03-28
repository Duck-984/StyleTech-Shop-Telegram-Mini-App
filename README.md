# StyleTech Shop - Telegram Mini App

Современный мультикатегорийный интернет-магазин в формате Telegram Mini App.

## Особенности

- 🛍️ Мультикатегорийный каталог (одежда, аксессуары, техника)
- 🌐 Поддержка двух языков (Русский / O'zbekcha)
- 🛒 Корзина с поддержкой размеров и цветов
- 📦 История заказов
- 👤 Профиль пользователя
- 🔐 Админ-панель с аутентификацией
- 💳 Множество способов оплаты
- 🚚 Доставка по Узбекистану
- 📱 Полная интеграция с Telegram WebApp

## Технологии

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **State Management**: Zustand
- **Routing**: React Router v6
- **Backend**: Supabase (Auth, Database, Realtime)
- **Icons**: Lucide React
- **Telegram**: Native WebApp API

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
```bash
npm install
```

3. Создайте `.env` файл на основе `.env.example`:
```bash
cp .env.example .env
```

4. Заполните переменные окружения в `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## База данных

База данных Supabase уже настроена со следующими таблицами:
- `categories` - категории товаров
- `products` - товары
- `users` - пользователи Telegram
- `orders` - заказы

Тестовые данные уже добавлены в базу данных.

## Админ-панель

Доступ к админ-панели: `/admin`

Дефолтные учетные данные:
- Email: `admin@shop.uz`
- Пароль: `Admin123`

**Важно**: Перед первым использованием создайте админ-пользователя в Supabase Auth с указанными выше credentials.

## Запуск

Разработка:
```bash
npm run dev
```

Сборка:
```bash
npm run build
```

Предпросмотр сборки:
```bash
npm run preview
```

## Структура проекта

```
src/
├── components/          # Компоненты (Layout, Header, ProductCard и т.д.)
├── pages/              # Страницы приложения
│   ├── admin/          # Админ-панель
│   ├── Home.tsx        # Выбор языка
│   ├── Catalog.tsx     # Каталог товаров
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Orders.tsx
│   └── Profile.tsx
├── store/              # Zustand stores
├── lib/                # Утилиты и конфигурация
│   ├── supabase.ts     # Supabase клиент
│   ├── telegram.ts     # Telegram WebApp API
│   ├── utils.ts        # Вспомогательные функции
│   └── translations.ts # Переводы
└── hooks/              # React hooks

## Telegram Mini App

Для тестирования в Telegram:
1. Создайте бота через @BotFather
2. Настройте Web App URL через @BotFather
3. Запустите приложение и откройте через бота

## Деплой

Рекомендуется деплой на Vercel:

1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения из `.env`
3. Деплой произойдет автоматически

## Лицензия

MIT
