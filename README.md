# StyleTech Shop - Telegram Mini App

Современный мультикатегорийный интернет-магазин в формате Telegram Mini App для рынка Узбекистана.

## Особенности

- Мультикатегорийный каталог (одежда, аксессуары, техника)
- Поддержка двух языков (Русский / O'zbekcha)
- Корзина с выбором размеров и цветов
- История заказов со статусами и таймлайном
- Профиль пользователя с реферальной программой
- Промо-баннеры с каруселью
- Доставка по Узбекистану с зональным ценообразованием
- Множество способов оплаты: Payme, Click, Uzum Bank, Наличные
- Полная интеграция с Telegram WebApp (хаптик, кнопки, данные пользователя)
- Админ-панель с ролевым доступом
- Отслеживание просмотров товаров

## Технологии

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router v7
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **Icons**: Lucide React
- **Telegram**: Native WebApp SDK (@tma.js/sdk-react)
- **Deployment**: Vercel (frontend) + Supabase (backend)

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

База данных Supabase содержит следующие таблицы:

- `categories` - категории товаров
- `products` - товары с вариантами (размеры, цвета), спецификациями и счётчиком просмотров
- `users` - пользователи Telegram
- `orders` - заказы с историей статусов
- `banners` - рекламные баннеры
- `delivery_zones` - зоны доставки с ценами и сроками
- `referrals` - реферальные коды и бонусы
- `reviews` - отзывы на товары
- `promotions` - акции и скидки

Все таблицы защищены через Row Level Security (RLS).

## Оплата (Edge Functions)

Обработка платежей реализована через Supabase Edge Functions:

- `create-payment` - создаёт платёжную ссылку (Payme / Click / Uzum Bank)
- `payme-callback` - обрабатывает webhook-уведомления от Payme

Необходимые секреты для Edge Functions:
```
PAYME_MERCHANT_ID
PAYME_BASE_URL
CLICK_MERCHANT_ID
CLICK_SERVICE_ID
CLICK_SECRET_KEY
UZUM_MERCHANT_ID
UZUM_API_KEY
UZUM_BASE_URL
```

## Админ-панель

Доступ: `/admin`

Учётные данные по умолчанию:
- Email: `admin@shop.uz`
- Пароль: `Admin123`

### Роли

| Роль      | Пользователи | Заказы | Товары | Баннеры | Доставка |
|-----------|:---:|:---:|:---:|:---:|:---:|
| admin     | +   | +   | +   | +   | +   |
| manager   | -   | +   | -   | +   | +   |
| seller    | -   | -   | +   | -   | -   |

### Возможности

- **Дашборд**: KPI-карточки, график продаж за 7 дней, топ-5 товаров, последние заказы
- **Товары**: CRUD, управление остатками (инкремент/декремент), активация/деактивация
- **Заказы**: смена статусов (новый → обработка → сборка → доставка → доставлен), история статусов
- **Пользователи**: список и назначение ролей
- **Баннеры**: CRUD с поддержкой мультиязычности
- **Доставка**: зоны, цены (стандарт/экспресс), порог бесплатной доставки

## Запуск

Разработка:
```bash
npm run dev
```

Сборка:
```bash
npm run build
```

Проверка типов:
```bash
npm run typecheck
```

## Структура проекта

```
src/
├── components/          # Layout, Header, BottomNav, ProductCard, BannerSlider, Toast
├── pages/
│   ├── admin/           # AdminDashboard, AdminProducts, AdminOrders, AdminUsers, AdminBanners, AdminDelivery
│   ├── Home.tsx         # Выбор языка + регистрация пользователя
│   ├── Catalog.tsx      # Каталог с поиском и фильтрами
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── Orders.tsx
│   └── Profile.tsx
├── store/               # useAppStore (язык, Telegram user ID), useCartStore
├── lib/
│   ├── supabase/        # Supabase клиент, хуки, запросы
│   ├── telegram.ts      # Telegram WebApp API
│   ├── auth.ts          # Аутентификация и роли
│   ├── utils.ts         # Вспомогательные функции
│   └── translations.ts  # Переводы (ru/uz)
└── hooks/               # useTranslation
supabase/
├── functions/           # Edge Functions (create-payment, payme-callback)
└── migrations/          # SQL-миграции
```

## Telegram Mini App

1. Создайте бота через @BotFather
2. Добавьте Web App через команду `/newapp` или `/setmenubutton`
3. Укажите URL задеплоенного приложения
4. Откройте через бота для тестирования

## Деплой

Подробные инструкции — в файле `DEPLOYMENT.md`.

Быстрый старт на Vercel:
1. Подключите репозиторий к Vercel
2. Добавьте переменные окружения (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
3. Деплой произойдёт автоматически при пуше в `main`

## Лицензия

MIT
