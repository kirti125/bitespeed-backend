# 🚀 BiteSpeed Backend – Identity Reconciliation API

## 📌 Problem Statement

Build an Identity Reconciliation API that links multiple contact records based on shared **email** or **phone number**.

If different requests contain overlapping contact information, the system should:

- Maintain one **primary contact**
- Link other related contacts as **secondary**
- Return a consolidated response with all linked information

---

## 🛠 Tech Stack

- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL (Render)
- Deployed on Render

---

## 🌐 Live Deployment

Base URL:

https://bitespeed-backend-lrzf.onrender.com

---

## 📮 API Endpoint

### POST `/identify`

Reconciles identity based on email or phone number.

### Request Body (JSON)

```json
{
  "email": "a@test.com",
  "phoneNumber": "222"
}
```

Both fields are optional, but at least one must be provided.

---

### Response Example

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["a@test.com"],
    "phoneNumbers": ["222"],
    "secondaryContactIds": []
  }
}
```

---

## 🧠 Logic Overview

1. If no matching contact exists → Create a new primary contact.
2. If matching contact exists → Link as secondary contact.
3. If multiple primary contacts are found → Merge under the oldest primary contact.
4. Return consolidated contact information.

---

## 🗄 Database Schema (Prisma)

Each contact contains:

- id
- email
- phoneNumber
- linkedId
- linkPrecedence (primary / secondary)
- createdAt
- updatedAt
- deletedAt

---

## ⚙️ Local Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/kirti125/bitespeed-backend.git
cd bitespeed-backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

```
DATABASE_URL=your_postgresql_connection_string
```

### 4️⃣ Run migrations

```bash
npx prisma migrate dev
```

### 5️⃣ Start development server

```bash
npm run dev
```

---

## 🚀 Production Build

```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
src/        → Application logic
prisma/     → Prisma schema & migrations
dist/       → Compiled output
```

---

## ✨ Author

Kirti Yadav
