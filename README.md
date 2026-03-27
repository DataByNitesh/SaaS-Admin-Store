# SaaS Admin Store Dashboard

A modern, full-stack Admin Dashboard built for managing products, coordinating user roles, and monitoring system data. Engineered with a scalable MERN stack (MongoDB, Express, React, Node.js) and dynamically styled with Tailwind CSS.

## 🔑 Demo Credentials
**Admin Access**
- **Email:** `admin@example.com`
- **Password:** `admin@password`

## 🚀 Key Features

### 🔐 Advanced Authentication & RBAC
- **Strict Role-Based Access Control (RBAC):** Restricts data access entirely via JWT authorization. Secure handling of standard user versus administrator permissions directly on backend logic.
- **Frontend Protection:** React-Router `ProtectedRoute` wrappers prevent non-admin profiles from accessing sensitive routes (e.g., Users list) or seeing unauthorized Navigation items.

### 📦 Dynamic Product Management
- **Complex CRUD Operations:** Seamless addition, editing, and deletion of products. 
- **Image Upload Integration:** Support for direct `multipart/form-data` image uploads and cloud static-file serving.
- **Catalog Navigation:** Real-time search, category filtering, sorting algorithms, and built-in pagination limits for scale.

### 🛡️ Graceful UX & Error Handling
- **Session Caching:** Synchronous `localStorage` session parsing reduces API polling latency.
- **Mongoose Validation Context:** Express `errorHandler` natively surfaces Mongoose Validation errors & Duplicate Key constraints as readable `400 Bad Request` alerts to the frontend client instead of obscure 500 Network errors.
- **Auto-Routing:** Single Page Application (SPA) natively redirects anonymous users to `/login` and authenticated profiles to designated dashboard screens.

---

## 💻 Tech Stack
* **Frontend:** React.js, Vite, Tailwind CSS, Axios, React-Router-DOM
* **Backend:** Node.js, Express.js, JWT Auth, Multer
* **Database:** MongoDB, Mongoose ORM

## ⚙️ Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DataByNitesh/SaaS-Admin-Store.git
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   # Create a .env file containing: VITE_API_URL=http://localhost:8000/api
   npm run dev
   ```

3. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file containing your PORT, MONGO_URI, and JWT_SECRET
   npm run dev
   ```

## 🌐 Deployment Ready
This project is configured environment-variable ready for easy deployment to cloud platforms like Vercel (Frontend) and Render (Backend). Advanced configurations like `vercel.json` rewrites and variable `CORS` endpoints are included out of the box.
