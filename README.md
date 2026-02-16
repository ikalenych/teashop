# TeaShop - E-commerce Platform

## Опис проекту

TeaShop – це повноцінна e-commerce платформа для продажу чайної продукції. Додаток включає:

- Каталог товарів з розширеним фільтруванням (за категорією, ціною, рівнем кофеїну)
- Кошик та процес оформлення замовлення
- Автентифікацію користувачів за допомогою JWT токенів
- Адміністративну панель для управління товарами, замовленнями та статистикою

## Стек технологій

**Frontend:**

- React 18 + TypeScript
- Tailwind CSS для стилізації
- React Router для навігації
- Context API для глобального стану

**Backend:**

- Node.js + Express.js
- Prisma ORM для роботи з базою даних
- PostgreSQL
- JWT Authentication

## Встановлення

### Передумови

- Node.js версії 18 або вище
- Docker (для запуску PostgreSQL)

## Інструкція з запуску

### Backend

cd backend  
npm install  
npm run dev

### Frontend

cd frontend  
npm install  
npm run dev
