# Contributing to GymFlow

Thank you for your interest in contributing to **GymFlow** 🚀
We welcome contributions that improve the project, fix bugs, or add new features.

---

## 📌 About the Project

GymFlow is a full-stack gym management system that helps:

* Gym owners manage members, payments, and trainers
* Gym members track workouts, nutrition, and memberships

---

## 🛠️ Tech Stack

**Frontend**

* React
* Vite
* TailwindCSS

**Backend**

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Socket.io

---

## 🚀 Getting Started

### 1. Fork the Repository

Click on the **Fork** button and clone your fork:

```bash
git clone https://github.com/your-username/gymflow.git
cd gymflow
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

Create `.env` file:

```bash
cp .env.example .env
```

Update environment variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/gymflow

JWT_SECRET=your_secret_key
JWT_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=7d

NUTRIENT_API_KEY=your_api_key
NUTRIENT_API_URL=https://api.logmeal.com/v2

FRONTEND_URL=http://localhost:3000
SOCKET_PORT=5001
```

Run backend:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5001
```

Run frontend:

```bash
npm run dev
```

---

## 🔧 Contribution Guidelines

### ✅ What you can contribute

* Bug fixes
* New features
* UI/UX improvements
* Performance optimization
* Documentation improvements

---

### ⚠️ Before You Start

* Check existing issues to avoid duplicates
* Create a new issue if your feature doesn’t exist
* Wait for approval before large changes

---

### 🌿 Branch Naming Convention

```bash
feature/your-feature-name
fix/bug-description
docs/update-readme
```

---

### 💻 Commit Message Format

```bash
feat: add workout tracking feature
fix: resolve login bug
docs: update README
```

---

### 🔁 Pull Request Process

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Commit your changes
5. Push to your fork
6. Create a Pull Request

---

### 📋 PR Requirements

* Clear description of changes
* Screenshots (if UI changes)
* No breaking changes without explanation
* Code should be clean and readable

---

## 🧪 Testing

Before submitting a PR:

* Ensure backend runs without errors
* Ensure frontend builds successfully
* Test key features like authentication, APIs, and UI

---

## 🚫 Do Not

* Push directly to `main` branch
* Commit sensitive data (.env, API keys)
* Add unnecessary dependencies

---

## 🤝 Code of Conduct

* Be respectful and professional
* Help others and collaborate
* Keep discussions constructive

---

## 📬 Need Help?

If you have questions:

* Open an issue
* Start a discussion

---

Thank you for contributing to **GymFlow** 💪
