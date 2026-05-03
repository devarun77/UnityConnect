# 🤝 UnityConnect

> **Connect with friends without exaggeration.** A true social media platform with no stories, no bluffs—just genuine connections!

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Features](#features)
- [🛠 Tech Stack](#tech-stack)
- [📁 Project Structure](#project-structure)
- [🚀 Quick Start](#quick-start)
- [🔧 Configuration](#configuration)
- [📜 Available Scripts](#available-scripts)
- [🌐 API Reference](#api-reference)
- [📝 Notes](#notes)

---

## Overview

**UnityConnect** is a modern social networking platform that empowers users to:
- Build authentic professional and personal profiles
- Discover and connect with like-minded individuals
- Share thoughts and experiences through posts and media
- Engage with the community through likes and comments
- Network with verified connections

Built with cutting-edge technologies, UnityConnect delivers a seamless, responsive experience across all devices.

---

## ✨ Features

### 🔐 Authentication & Profiles
- ✅ User registration and login with token-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Profile creation and detailed profile management
- ✅ Profile picture upload and updates
- ✅ Profile download as PDF resume

### 👥 Networking
- ✅ Discover other users with an interactive discovery page
- ✅ View profiles by username with work history
- ✅ Send and receive connection requests
- ✅ Accept or reject connection requests
- ✅ View pending connection requests and confirmed network

### 📱 Social Features
- ✅ Create posts with optional media uploads
- ✅ View global feed of active posts
- ✅ Like posts with real-time counter updates
- ✅ Comment on posts with rich engagement
- ✅ Delete your own posts and comments
- ✅ Recent activity section on user profiles
- ✅ Share posts on Twitter

### 🎨 User Experience
- ✅ Responsive dashboard and layout components
- ✅ Intuitive navigation with Redux state management
- ✅ Toast notifications for user feedback
- ✅ Smooth animations and transitions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **Next.js 16.2** | React framework with SSR and static generation |
| **React 19.2** | UI library |
| **Redux Toolkit** | State management |
| **Axios** | HTTP client for API requests |
| **React Toastify** | Toast notifications |
| **CSS Modules** | Component-scoped styling |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express 5.2** | Web framework |
| **MongoDB 9.3** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **Multer** | File upload handling |
| **Bcrypt** | Password encryption |
| **PDFKit** | PDF document generation |

### Storage
- 📂 Local file uploads in `backend/uploads/`

---

## 📁 Project Structure

```
UnityConnect/
├── backend/
│   ├── controllers/         # Business logic
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── utils/              # Helper functions
│   ├── uploads/            # Uploaded files & PDFs
│   ├── server.js           # Express app entry
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/          # Next.js pages
│   │   ├── components/     # Reusable components
│   │   ├── config/         # Redux store & API config
│   │   ├── layout/         # Layout components
│   │   └── styles/         # Global styles
│   ├── package.json
│   └── next.config.mjs
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or higher
- **npm** or **yarn**
- **MongoDB** connection string (local or cloud)

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd UnityConnect
```

### 2️⃣ Setup Backend

```bash
cd backend

# Create .env file
echo "PORT=9000
MONGO_URL=<your-mongodb-connection-string>" > .env

# Install dependencies
npm install

# Start the server
npm run dev
```

✅ Backend running at `http://localhost:9000`

### 3️⃣ Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Update API URL in src/config/index.jsx if needed
# Start the development server
npm run dev
```

✅ Frontend running at `http://localhost:3000`

---

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# Server
PORT=9000

# Database
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/unityconnect
```

### Frontend API Configuration

Update `frontend/src/config/index.jsx`:

```javascript
export const BASE_URL = "http://localhost:9000"  // Local development
// export const BASE_URL = "https://your-api.com"  // Production
```

---

## 📜 Available Scripts

### Backend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm run prod` | Start in production mode |

### Frontend Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint checks |

---

## 🌐 API Reference

### Authentication
- `POST /register` - Create a new account
- `POST /login` - Login and receive token

### User Profile
- `GET /get_user_and_profile` - Fetch your profile
- `POST /user_update` - Update account details
- `POST /update_profile_picture` - Upload profile picture
- `POST /update_profile_data` - Update profile info
- `GET /user/get_all_users` - Browse all users
- `GET /user/get_profile_based_on_username` - View profile by username
- `GET /user/download_resume` - Download profile as PDF

### Connections
- `POST /user/send_connection_request` - Send connection request
- `GET /user/getConnectionRequests` - Get requests you sent
- `GET /user/user_connection_request` - Get requests you received
- `POST /user/accept_connection_request` - Accept/reject request

### Posts
- `POST /post` - Create a post with media
- `GET /posts` - Fetch all posts
- `DELETE /delete_post` - Delete your post
- `POST /increament_post_like` - Like a post

### Comments
- `POST /comment` - Add comment to post
- `GET /get_comments` - Fetch post comments
- `DELETE /delete_comment` - Delete your comment

---

## 📝 Notes

- 📂 All uploads are stored in `backend/uploads/`
- 🔒 Passwords are hashed; never stored in plain text
- 🌐 Token-based authentication for secure API access
- ⚙️ Ensure backend and frontend URLs match for local development
- 🚀 PDFs are generated on-demand and stored locally

---

## 📄 License

No license has been specified yet.

---

<div align="center">

### Made with 💙 for genuine connections

</div>
