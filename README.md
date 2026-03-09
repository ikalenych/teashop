# TeaShop - E-commerce Platform

## Опис проекту

TeaShop — це повноцінна e-commerce платформа для продажу чайної продукції.  
Додаток включає:

- каталог товарів з розширеним фільтруванням (категорія, ціна, рівень кофеїну)
- кошик покупок
- процес оформлення замовлення
- автентифікацію користувачів за допомогою JWT
- адміністративну панель для управління товарами, замовленнями та статистикою

---

## Стек технологій

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- React Router
- Context API

### Backend

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication

---

## Передумови

Перед запуском переконайтесь, що встановлено:

- Node.js **18+**
- Docker (для запуску PostgreSQL)

---

# Встановлення та запуск

## 1. Клонування репозиторію

```bash
git clone https://github.com/your-username/tea-shop.git
cd tea-shop
```

---

## 2. Запуск Backend

```bash
cd backend

npm install

npm run dev
```

Backend буде доступний за адресою:

```
http://localhost:5000
```

---

## 3. Запуск Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend буде доступний за адресою:

```
http://localhost:5173
```

---

## Основні можливості

- перегляд каталогу чаю
- фільтрація товарів
- додавання товарів у кошик
- оформлення замовлення
- авторизація користувачів
- адміністративна панель

---

## База даних

У проекті використовується **PostgreSQL** разом із **Prisma ORM**.

Приклад запуску міграцій:

```bash
npx prisma migrate dev
```

Запуск Prisma Studio:

```bash
npx prisma studio
```
