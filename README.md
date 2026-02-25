🚀 BiteSpeed Backend – Identity Reconciliation API
📌 Overview

This project implements an Identity Reconciliation API that links multiple contact records based on shared:

Email

Phone Number

The system maintains a primary contact and associates secondary contacts when duplicate or related information is detected.

🛠 Tech Stack

Node.js

TypeScript

Express

Prisma ORM

PostgreSQL (Render)

Deployed on Render

🌐 Live API

Base URL:

https://bitespeed-backend-lrzf.onrender.com
📮 API Endpoint
POST /identify

Reconciles identity based on email or phone number.

Request Body (JSON)
{
  "email": "a@test.com",
  "phoneNumber": "222"
}
Response Example
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["a@test.com"],
    "phoneNumbers": ["222"],
    "secondaryContactIds": []
  }
}
🧠 How It Works

If no contact exists → Creates a new primary contact

If matching email/phone exists → Links as secondary contact

If multiple contacts are connected → Merges under the oldest primary contact

🗄 Database Schema (Prisma)

The system maintains:

id

email

phoneNumber

linkedId

linkPrecedence (primary / secondary)

createdAt

updatedAt

deletedAt

⚙️ Local Setup
1️⃣ Clone the repo
git clone https://github.com/your-username/bitespeed-backend.git
cd bitespeed-backend
2️⃣ Install dependencies
npm install
3️⃣ Create .env
DATABASE_URL=your_postgres_connection_string
4️⃣ Run migrations
npx prisma migrate dev
5️⃣ Start server
npm run dev
🚀 Production Build
npm run build
npm start
📂 Project Structure
src/        → Application logic
prisma/     → Prisma schema & migrations
dist/       → Compiled output (ignored in git)
📈 Deployment

Deployed using Render Web Service
Database hosted on Render PostgreSQL

✨ Author

Kirti Yadav
