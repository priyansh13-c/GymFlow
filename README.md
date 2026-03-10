# GymFlow - Gym Management System

GymFlow is a full-stack gym management web application that helps gym owners manage members and allows gym members to track workouts, memberships, and nutrition.

---

## 🚀 Features

### 🔐 Authentication
- JWT based authentication with refresh tokens
- Role-based access control
- Secure password hashing

### 🏋️ Gym Owner Features
- Create and manage gym profile
- Generate gym codes for member registration
- View gym members and statistics
- Track payments and revenue
- Post notices to all gym members
- Manage trainers and bookings

### 👤 Gym Member Features
- Join gyms using a unique gym code
- View membership details and expiry date
- Log workouts and exercises
- Track calories using AI food image analysis
- Book trainer sessions
- Receive gym notices and updates

### ⚡ Advanced Features
- Real-time notifications using Socket.io
- Membership expiry reminders using Cron Jobs
- Workout and nutrition tracking
- Payment tracking system
- Responsive dashboards with analytics

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- TailwindCSS

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Socket.io

---

## 💻 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gymflow.git
cd gymflow

## 🚀 Getting Started

### Backend Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Create .env file**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB**
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

4. **Run server**
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
```bash
cd frontend
npm install
```

2. **Create .env file** (optional)
```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5001
```

3. **Run development server**
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🔌 Environment Variables

### Backend (.env)
```
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

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5001
```

## 📊 Key Features Explained

### 1. JWT Authentication
- Access tokens expire in 15 minutes
- Refresh tokens valid for 7 days
- Refresh tokens stored in database for revocation
- Automatic token refresh on 401 response

### 2. Real-time Notifications
- Socket.io for real-time updates
- Members receive instant notices
- Trainer availability updates
- Membership reminders

### 3. Role-based Access Control
- `gym_owner`: Can create gyms, manage members, post notices, view analytics
- `gym_member`: Can join gyms, log workouts, track calories, book trainers

### 4. Membership Expiry Management
- Automatic daily check (9:00 AM)
- 7-day expiry warning system
- Members reminded via notifications
- Expired memberships auto-deactivated

### 5. AI Calorie Estimation
- Upload food images
- API integration with nutrition databases
- Automatic macro calculation
- Daily nutrition tracking

### 6. Payment Tracking
- Multiple payment methods supported
- Transaction history
- Revenue analytics and graphs
- Refund management

## 🛡️ Security Features

✅ Password hashing with bcrypt
✅ JWT authentication with refresh tokens
✅ CORS protection
✅ Helmet.js for security headers
✅ Rate limiting on API routes
✅ Input validation with Joi
✅ Role-based access control
✅ File upload restrictions (images only, max 5MB)
✅ Token revocation on logout

---

**Happy Coding! 💪🏋️**
