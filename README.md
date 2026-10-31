# 🌱 AgriTech – Smart Farming Management System

A simple, robust, and fully responsive **MERN stack** (MongoDB Atlas/Mongoose, Express.js, React.js, Node.js) web application designed to empower farmers with digital tools that enhance agricultural productivity, precision soil management, weather forecasting, and crop tracking.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite, Bootstrap 5, Bootstrap Icons, Axios, React Router v6
- **Backend**: Node.js, Express.js, Express Router
- **Database**: MongoDB (connected via Mongoose ORM)
- **Authentication & Security**: JSON Web Tokens (JWT), bcryptjs (10 salt rounds), Role-Based Access Control (RBAC)
- **Weather Services**: OpenWeatherMap API & Open-Meteo Satellite Feed with smart local fallback

---

## 🌟 Core Features & Modules

### 1. Home Page (`/`)
- AgriTech branding and clean navigation bar.
- Hero section: *"Smart Farming, Better Future"*.
- Project introduction, feature cards, and responsive footer.
- Direct quick-links for Farmer Registration, Sign In, and Crop Management.

### 2. Farmer Authentication
- **Registration (`/register`)**: Farmer name, email, password (hashed with bcrypt), and location.
- **Login (`/login`)**: Email and password verification returning a signed JWT token.
- **1-Click Demo Login**: Pre-configured buttons for instant evaluation as **Farmer** (`farmer@agritech.com`) or **Admin** (`admin@agritech.com`).
- **Logout**: Secure token invalidation on client and immediate session termination.

### 3. Farmer Dashboard (`/dashboard`)
- Personalized welcome banner showing farmer name and registered location.
- Real-time metrics: Total Crops, Farm Location, and Educational Pest Alerts.
- Integrated **Live Weather Forecast** with dynamic spraying and irrigation advisories.
- **Indicative Soil Health Assessment** calculator with agronomic action plans.
- Educational pest prevention and identification cards.

### 4. Crop Management (`/crops`)
- **Add Crop**: Crop name, land area (in acres), sowing date, and crop status.
- **View Crops**: Visual cards and responsive tabular view of active crop records.
- **Edit Crop**: In-place modal to modify crop parameters, growth stage, and land area.
- **Delete Crop**: Permanent removal with confirmation dialog and alert notifications.
- **Data Isolation**: Strictly scoped so farmers can only view and manage their own crops.

### 5. Weather Forecast (`/weather`)
- City / district search input with auto-suggestions for popular agricultural regions.
- Displays Temperature (°C), Relative Humidity (%), Weather Conditions, Wind Speed (km/h), and Rain Risk.
- Dynamic agronomic advice: Safe spraying windows and irrigation need indicators.
- Graceful error handling for unrecognized locations.

### 6. Soil Health Analysis (`/soil`)
- Diagnostic form accepting **Soil Type**, **Soil pH**, and **Moisture Level (%)**.
- Generates fertility score (out of 100) and qualitative health status (*Optimal*, *Acidic*, *Alkaline*, *Moisture Deficit*).
- Prescriptive recommendations for soil amendments (Agricultural Lime, Gypsum, Organic Green Manure).
- Educational assessment disclaimer.

### 7. Farm Profile Management (`/farms`)
- Farm plot registration with name, location, acreage, and soil type.
- View, update, and manage multiple farm plots linked to the farmer's account.

### 8. Admin Dashboard & Security Console (`/admin`)
- **Admin Authentication**: Restricted to authorized administrative accounts (`role: 'admin'`).
- **Total Farmers & Total Crops**: Live counters connected to MongoDB Atlas.
- **Registered Farmer Directory**: Full directory with location, join date, platform role, and role management (`farmer`, `expert`, `admin`).
- **All Crop Records**: System-wide crop monitoring across all registered farmers.
- **Authorized Admin Operations**: Capability to update roles, remove obsolete crops, and delete farmer profiles.

---

## 🔒 Security Architecture

1. **JWT Authentication**: Private API routes are guarded with `Authorization: Bearer <token>`.
2. **Bcrypt Password Hashing**: Passwords are automatically hashed with 10 salt rounds prior to persistence.
3. **Password Protection**: Database queries systematically exclude password fields (`.select('-password')`).
4. **Role-Based Access Control (RBAC)**: Admin routes are enforced by `adminOnly` middleware (returns HTTP 403 Forbidden to non-admin users).
5. **Data Isolation**: Crop and farm records strictly check `farmerId: req.user._id`, preventing farmers from accessing or tampering with other farmers' records.
6. **Input Validation**: Rejection of empty crop names, invalid land areas, invalid dates, or unauthorized roles.

---

## 🚀 Setup & Installation Instructions

### 1. Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (Local instance or MongoDB Atlas cluster URI)
- **npm** (v8 or higher)

### 2. Clone and Setup Environment
Copy `.env.example` to `backend/.env`:
```bash
cp .env.example backend/.env
```

Ensure your `backend/.env` contains:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/agritech
JWT_SECRET=your_jwt_secret_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
NODE_ENV=development
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Build Frontend & Run Server
```bash
# Build the production frontend bundle
cd frontend
npm run build

# Start the unified AgriTech server
cd ../backend
node server.js
```

Open your browser at **[http://localhost:5000](http://localhost:5000)**.

---

## 🔑 Demo Login Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@agritech.com` | `password123` | Farmer Dashboard & Crop Management |
| **Admin** | `admin@agritech.com` | `admin123` | Admin Dashboard & Security Console |

---

## 📡 REST API Reference

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | GET | Public | System status & MongoDB connectivity check |
| `/api/auth/register` | POST | Public | Register new farmer account |
| `/api/auth/login` | POST | Public | Authenticate user & issue JWT |
| `/api/auth/me` | GET | Private | Fetch logged-in user profile |
| `/api/crops` | GET | Private | List all crops belonging to logged-in farmer |
| `/api/crops` | POST | Private | Add new crop to MongoDB |
| `/api/crops/:id` | GET | Private | View single crop details (ownership protected) |
| `/api/crops/:id` | PUT | Private | Update crop record (ownership protected) |
| `/api/crops/:id` | DELETE | Private | Delete crop record (ownership protected) |
| `/api/crops/analyze-soil` | POST | Public | Educational soil health diagnostic |
| `/api/farms` | GET / POST | Private | List and add farm profiles |
| `/api/farms/:id` | PUT / DELETE | Private | Update or delete farm plot |
| `/api/weather` | GET | Public | Live weather forecast & spraying advisory |
| `/api/pests` | GET | Public | Educational pest advisories |
| `/api/admin/farmers` | GET | Admin | List all registered farmers |
| `/api/admin/total-farmers` | GET | Admin | Count total registered farmers |
| `/api/admin/total-crops` | GET | Admin | Count total monitored crops |
| `/api/admin/crops` | GET | Admin | View all crop records across farmers |
| `/api/admin/crops/:id` | DELETE | Admin | Admin delete crop record |
| `/api/admin/farmers/:id` | DELETE | Admin | Admin delete farmer and associated data |
| `/api/admin/users/:id/role` | PUT | Admin | Update user platform role |
