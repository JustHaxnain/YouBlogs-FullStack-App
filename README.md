# 🚀 Full-Stack Blog Platform (Manual OAuth, RBAC, Token Security)

![YouBlogs](/client/public/YouUIDesktop.png "YouBlogs Screenshot")

![License](https://img.shields.io/badge/License-MIT-green.svg)
![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Express%20%7C%20MySQL-blue)
![Auth](https://img.shields.io/badge/Auth-Google%20OAuth%202.0-orange)
![Security](https://img.shields.io/badge/Security-HTTPOnly%20Cookies%20%7C%20Token%20Rotation-red)

> A modern blog application built with a **security-first architecture** — featuring **manual Google OAuth 2.0**, **cookie-based sessions**, **refresh token rotation**, **RBAC authorization via ownership checks**, and **full pagination & search support**.

---

## 📦 Tech Stack

| Layer        | Technology                                                              |
| ------------ | ----------------------------------------------------------------------- |
| **Frontend** | React (Vite), React Router, Context API, CSS                            |
| **Backend**  | Node.js, Express.js                                                     |
| **Database** | MySQL (`mysql2`)                                                        |
| **Auth**     | Manual Google OAuth 2.0 (No Passport.js), Access/Refresh Token Strategy |
| **Other**    | dotenv, CORS, RESTful API, Fetch API                                    |

---

## ✨ Core Features

✅ **Manual OAuth 2.0 Login Flow (No Passport.js)**  
✅ **HttpOnly Cookie-Based Sessions (No LocalStorage exposure)**  
✅ **Refresh Token Rotation & Invalidation (Stored in DB column)**  
✅ **RBAC Authorization Based on Content Ownership**  
✅ **Backend Middleware Pipeline (Access → Refresh → Ownership Check)**  
✅ **Pagination & Search via URL Query Params (`?search=&page=&limit=`)**  
✅ **Fully Modular, Extensible Frontend & Backend Architecture**

---

## 📁 Folder Structure

### **Frontend (`/client`)**

```
client/
├── api/          # Centralized API wrappers
├── app/          # Routing (React Router + lazy + loaders)
├── components/   # UI components (BlogCard, Header, Pagination...)
├── pages/        # Screens / Views
├── styles/       # CSS
├── utils/        # Context, Auth Guarded Routes
├── index.jsx     # App Entry
├── .env          # Frontend environment config
```

### **Backend (`/server`)**

```
server/
├── controllers/   # Route handlers
├── db/
│   ├── models/    # Query logic
│   ├── MySQL/     # Schema
│   └── database.js# Pool setup
├── middleware/    # Auth guards, refresh logic, ownership validation
├── routes/        # Route groups (authentication, user, blog, feed)
├── utils/         # Helpers
├── server.js      # Server Entry
├── .env           # Secrets
```

---

## 🌐 API Overview (Condensed)

| Group                          | Purpose                             |
| ------------------------------ | ----------------------------------- |
| `/authentication`              | Google login, refresh, logout       |
| `/user`                        | Session validation / profile        |
| `/blog`                        | Publish, edit, delete (author-only) |
| `/getBlog` / `/getBlogDetails` | Feed & detail fetch (public)        |
| `/blogAction`                  | Future interactions (likes, etc.)   |

---

## 🔧 Getting Started

```bash
# Clone
git clone https://github.com/your-username/blog-platform.git
cd blog-platform
```

### Backend Setup

```bash
cd server
npm install
```

Create `.env` in `/server`:

```
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=http://localhost:5173
```

```bash
node server.js
```

---

### Frontend Setup

```bash
cd ../client
npm install
```

Create `.env` in `/server`:

```
VITE_GOOGLE_CLIENT_ID =
```

```bash
npm run dev
```

---

-   Frontend → `http://localhost:5173`
-   Backend → `http://localhost:8080`

---

## 🧭 Frontend Architecture Highlights

-   🔄 **URL-Synced Search & Pagination** (`useSearchParams`)
-   💤 **Lazy-loaded Pages + Suspense + Await**
-   🔐 **AuthContext + Protected & Guest Route Guards**
-   📡 **Centralized API Wrapper w/ Credential-Aware Requests**

---

## 📸 Preview

![YouBlogs](/client/public/BlogUIDesktop.png "YouBlogs Screenshot")
![YouBlogs](/client/public/HomeUISmall.png "YouBlogs Screenshot")
![YouBlogs](/client/public/EditUI.png "YouBlogs Screenshot")

---

## 🛡️ Security Philosophy

> \*Authentication isn’t hard. **Secure authentication is.\***  
> This project **avoids shortcuts** like Passport.js and instead implements **manual OAuth, refresh token rotation, secure cookie storage, and ownership-based access validation** — **exactly how production apps should do it.**

---

## 📝 License

MIT

This project is licensed under the **MIT License** — free to use and modify.

---
