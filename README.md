# Project Introduction

This project is a multi-purpose web application built with Next.js, React, and Tailwind CSS, designed to showcase a variety of features in a single platform.

At its core, the project provides:

### 1. User Authentication
- Login and email verification via NextAuth.

### 2. Post-Login Features
- **To-Do List, Blog, and Gallery**  
  Data is stored in a PostgreSQL database via Prisma ORM.
- **Book Store / E-Commerce**  
  - Users can browse products, add items to a cart, and proceed to checkout (no card payments integrated).  
  - Admin product management page for adding, editing, and deleting products.  
  - Product images and assets are managed using Vercel Blob Storage.

The project is fully responsive, uses server-side actions, and demonstrates modern React + Next.js 15 App Router best practices.

---

# Installation & Setup Guide

Follow these steps to run the project locally from scratch.

## 1. Prerequisites
- Node.js ≥ 20  
- npm (comes with Node.js) or yarn / pnpm  
- PostgreSQL database  
- Google account for sending emails (with App Password)  
- Vercel account for Blob Storage  

## 2. Clone the repository
```bash
git clone <your-repo-url>
cd <repo-folder>
````

## 3. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

## 4. Set up environment variables

Create a `.env` file in the project root:

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://USERNAME:PASSWORD@HOST:PORT/mydb

# NextAuth / Email
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=YOUR_16_CHAR_APP_PASSWORD
EMAIL_FROM=your-email@gmail.com
NEXTAUTH_URL=http://localhost:3000

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

Replace all placeholders with your actual credentials.
**Important:**

* Gmail App Password must be 16 characters, no spaces.
* Vercel Blob Token: generate in Vercel → Settings → Tokens.

## 5. Set up the database

1. Ensure PostgreSQL is running.
2. Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

3. Generate Prisma client:

```bash
npx prisma generate
```

## 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open your browser at [http://localhost:3000](http://localhost:3000). The app should now be fully functional, including login/email verification, To-Do List, Blog, Gallery (PostgreSQL backend), and Book Store / E-Commerce with Vercel Blob for product images.

## 5. Useful commands

| Command                  | Description                   |
| ------------------------ | ----------------------------- |
| `npm run dev`            | Start dev server              |
| `npm run build`          | Build production version      |
| `npm start`              | Start built production server |
| `npm run seed`           | Seed the database             |
| `npx prisma migrate dev` | Run migrations                |
| `npx prisma generate`    | Generate Prisma client        |
