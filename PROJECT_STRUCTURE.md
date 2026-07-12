# TransFlow - Complete Project Structure

## Complete Directory Tree

```
TransFlow/
│
├── 📄 README.md                          # Project overview & documentation
├── 📄 SETUP_GUIDE.md                     # Detailed setup instructions
├── 📄 PROJECT_STRUCTURE.md               # This file
├── 📄 package.json                       # Monorepo workspace configuration
├── 📄 .gitignore                         # Git ignore rules
│
│
├── 📁 client/                            # FRONTEND - React + Vite + TypeScript
│   │
│   ├── 📄 package.json                   # Frontend dependencies
│   ├── 📄 .env.example                   # Environment variables template
│   ├── 📄 index.html                     # HTML entry point
│   ├── 📄 vite.config.js                 # Vite build configuration
│   ├── 📄 tailwind.config.js             # Tailwind CSS design tokens
│   ├── 📄 postcss.config.js              # PostCSS configuration
│   ├── 📄 tsconfig.json                  # TypeScript configuration
│   ├── 📄 tsconfig.node.json             # TypeScript node config
│   │
│   ├── 📁 public/                        # Static assets
│   │   └── transflow-logo.png            # Brand logo
│   │
│   └── 📁 src/                           # Source code
│       │
│       ├── 📄 main.tsx                   # React entry point
│       ├── 📄 App.tsx                    # Main App component
│       ├── 📄 index.css                  # Global styles with Tailwind
│       │
│       ├── 📁 assets/                    # Images, icons, static files
│       │   ├── images/
│       │   ├── icons/
│       │   └── fonts/
│       │
│       ├── 📁 components/                # Reusable UI components
│       │   ├── 📁 common/                # Layout & navigation components
│       │   │   ├── Header.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Navbar.tsx
│       │   │   └── Footer.tsx
│       │   │
│       │   ├── 📁 ui/                    # UI primitives
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Modal.tsx
│       │   │   ├── Table.tsx
│       │   │   ├── Form.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Dropdown.tsx
│       │   │   ├── Badge.tsx
│       │   │   └── Tabs.tsx
│       │   │
│       │   └── 📁 charts/                # Chart components
│       │       ├── LineChart.tsx
│       │       ├── BarChart.tsx
│       │       ├── PieChart.tsx
│       │       └── AreaChart.tsx
│       │
│       ├── 📁 layouts/                   # Page layouts
│       │   ├── DashboardLayout.tsx       # Main dashboard layout with sidebar
│       │   ├── AuthLayout.tsx            # Auth pages layout
│       │   └── BlankLayout.tsx           # Minimal layout
│       │
│       ├── 📁 pages/                     # Feature-based pages
│       │   ├── 📁 auth/                  # Authentication pages
│       │   │   ├── LoginPage.tsx
│       │   │   ├── RegisterPage.tsx
│       │   │   ├── ForgotPassword.tsx
│       │   │   └── ResetPassword.tsx
│       │   │
│       │   ├── 📁 dashboard/             # Dashboard pages
│       │   │   ├── MainDashboard.tsx     # KPI cards & overview
│       │   │   ├── Analytics.tsx
│       │   │   └── Overview.tsx
│       │   │
│       │   ├── 📁 vehicles/              # Vehicle management
│       │   │   ├── VehicleList.tsx       # Table view
│       │   │   ├── VehicleDetail.tsx     # Single vehicle view
│       │   │   ├── AddVehicle.tsx        # Add/edit form
│       │   │   └── VehicleSchedule.tsx
│       │   │
│       │   ├── 📁 drivers/               # Driver management
│       │   │   ├── DriverList.tsx
│       │   │   ├── DriverDetail.tsx
│       │   │   ├── AddDriver.tsx
│       │   │   └── DriverSafetyScore.tsx
│       │   │
│       │   ├── 📁 trips/                 # Trip management
│       │   │   ├── TripList.tsx
│       │   │   ├── CreateTrip.tsx
│       │   │   ├── TripTracking.tsx
│       │   │   └── TripHistory.tsx
│       │   │
│       │   ├── 📁 maintenance/           # Maintenance management
│       │   │   ├── MaintenanceList.tsx
│       │   │   ├── MaintenanceForm.tsx
│       │   │   ├── MaintenanceSchedule.tsx
│       │   │   └── MaintenanceHistory.tsx
│       │   │
│       │   ├── 📁 fuel/                  # Fuel management
│       │   │   ├── FuelConsumption.tsx
│       │   │   ├── FuelLog.tsx
│       │   │   ├── AddFuelEntry.tsx
│       │   │   └── FuelAnalytics.tsx
│       │   │
│       │   ├── 📁 expenses/              # Expense management
│       │   │   ├── ExpenseList.tsx
│       │   │   ├── AddExpense.tsx
│       │   │   ├── ExpenseAnalytics.tsx
│       │   │   └── ExpenseApproval.tsx
│       │   │
│       │   └── 📁 reports/               # Reports & analytics
│       │       ├── FleetPerformance.tsx
│       │       ├── FuelEfficiency.tsx
│       │       ├── OperationalCost.tsx
│       │       ├── VehicleROI.tsx
│       │       └── ReportExport.tsx
│       │
│       ├── 📁 routes/                    # Routing configuration
│       │   ├── AppRoutes.tsx             # Main route configuration
│       │   ├── ProtectedRoute.tsx        # Auth-protected routes
│       │   └── routes.ts                 # Route constants
│       │
│       ├── 📁 services/                  # API service layer
│       │   ├── api.ts                    # Axios instance & interceptors
│       │   ├── authService.ts            # Auth API calls
│       │   ├── vehicleService.ts         # Vehicle API calls
│       │   ├── driverService.ts          # Driver API calls
│       │   ├── tripService.ts            # Trip API calls
│       │   ├── maintenanceService.ts     # Maintenance API calls
│       │   ├── fuelService.ts            # Fuel API calls
│       │   ├── expenseService.ts         # Expense API calls
│       │   └── reportService.ts          # Report API calls
│       │
│       ├── 📁 hooks/                     # Custom React hooks
│       │   ├── useAuth.ts                # Authentication hook
│       │   ├── useFetch.ts               # Data fetching hook
│       │   ├── useForm.ts                # Form handling hook
│       │   ├── useLocalStorage.ts        # Local storage hook
│       │   └── useNotification.ts        # Notification hook
│       │
│       ├── 📁 context/                   # React Context
│       │   ├── AuthContext.tsx           # User authentication state
│       │   ├── NotificationContext.tsx   # Global notifications
│       │   ├── ThemeContext.tsx          # Theme/dark mode
│       │   └── AppContext.tsx            # Global app state
│       │
│       ├── 📁 utils/                     # Utility functions
│       │   ├── formatters.ts             # Date, currency formatting
│       │   ├── validators.ts             # Input validation
│       │   ├── calculations.ts           # Business logic calculations
│       │   ├── constants.ts              # App-wide constants
│       │   ├── helpers.ts                # General helper functions
│       │   └── errorHandler.ts           # Error handling utilities
│       │
│       ├── 📁 constants/                 # Application constants
│       │   ├── api.ts                    # API endpoints
│       │   ├── roles.ts                  # User roles
│       │   ├── statuses.ts               # Entity statuses
│       │   ├── messages.ts               # UI messages
│       │   └── config.ts                 # App configuration
│       │
│       └── 📁 types/                     # TypeScript type definitions
│           ├── User.ts
│           ├── Vehicle.ts
│           ├── Driver.ts
│           ├── Trip.ts
│           ├── Maintenance.ts
│           ├── Fuel.ts
│           ├── Expense.ts
│           └── index.ts
│
│
├── 📁 server/                            # BACKEND - Express + Node.js
│   │
│   ├── 📄 package.json                   # Backend dependencies
│   ├── 📄 .env.example                   # Environment variables template
│   ├── 📄 nodemon.json                   # Nodemon watch configuration
│   │
│   └── 📁 src/                           # Source code
│       │
│       ├── 📄 server.js                  # Server entry point
│       ├── 📄 app.js                     # Express app setup & middleware
│       │
│       ├── 📁 config/                    # Configuration files
│       │   ├── db.js                     # MongoDB connection
│       │   ├── cloudinary.js             # Cloudinary setup
│       │   └── constants.js              # Constants
│       │
│       ├── 📁 controllers/               # Request handlers
│       │   ├── authController.js         # Authentication handlers
│       │   ├── userController.js         # User CRUD handlers
│       │   ├── vehicleController.js      # Vehicle CRUD handlers
│       │   ├── driverController.js       # Driver CRUD handlers
│       │   ├── tripController.js         # Trip handlers
│       │   ├── maintenanceController.js  # Maintenance handlers
│       │   ├── fuelController.js         # Fuel handlers
│       │   ├── expenseController.js      # Expense handlers
│       │   └── reportController.js       # Report handlers
│       │
│       ├── 📁 models/                    # MongoDB Mongoose schemas
│       │   ├── User.js                   # User schema (placeholder)
│       │   ├── Vehicle.js                # Vehicle schema (placeholder)
│       │   ├── Driver.js                 # Driver schema (placeholder)
│       │   ├── Trip.js                   # Trip schema (placeholder)
│       │   ├── Maintenance.js            # Maintenance schema (placeholder)
│       │   ├── FuelLog.js                # Fuel log schema (placeholder)
│       │   ├── Expense.js                # Expense schema (placeholder)
│       │   └── Notification.js           # Notification schema (placeholder)
│       │
│       ├── 📁 routes/                    # API route definitions
│       │   ├── authRoutes.js             # /api/auth routes
│       │   ├── userRoutes.js             # /api/users routes
│       │   ├── vehicleRoutes.js          # /api/vehicles routes
│       │   ├── driverRoutes.js           # /api/drivers routes
│       │   ├── tripRoutes.js             # /api/trips routes
│       │   ├── maintenanceRoutes.js      # /api/maintenance routes
│       │   ├── fuelRoutes.js             # /api/fuel routes
│       │   ├── expenseRoutes.js          # /api/expenses routes
│       │   └── reportRoutes.js           # /api/reports routes
│       │
│       ├── 📁 services/                  # Business logic layer
│       │   ├── authService.js            # Auth logic
│       │   ├── userService.js            # User operations
│       │   ├── vehicleService.js         # Vehicle operations
│       │   ├── driverService.js          # Driver operations
│       │   ├── tripService.js            # Trip operations
│       │   ├── maintenanceService.js     # Maintenance operations
│       │   ├── fuelService.js            # Fuel operations
│       │   ├── expenseService.js         # Expense operations
│       │   └── reportService.js          # Report generation
│       │
│       ├── 📁 middleware/                # Express middleware
│       │   ├── authMiddleware.js         # JWT verification
│       │   ├── roleMiddleware.js         # Role-based access control
│       │   ├── errorMiddleware.js        # Error handling
│       │   ├── validationMiddleware.js   # Request validation
│       │   ├── requestLogger.js          # Request logging
│       │   └── corsMiddleware.js         # CORS setup
│       │
│       ├── 📁 validators/                # Request validation schemas
│       │   ├── authValidator.js          # Auth request validation
│       │   ├── userValidator.js          # User request validation
│       │   ├── vehicleValidator.js       # Vehicle request validation
│       │   ├── driverValidator.js        # Driver request validation
│       │   ├── tripValidator.js          # Trip request validation
│       │   ├── maintenanceValidator.js   # Maintenance validation
│       │   ├── fuelValidator.js          # Fuel request validation
│       │   └── expenseValidator.js       # Expense request validation
│       │
│       ├── 📁 utils/                     # Utility functions
│       │   ├── tokenUtils.js             # JWT token operations
│       │   ├── errorUtils.js             # Error handling
│       │   ├── formatters.js             # Data formatting
│       │   ├── calculators.js            # Business calculations
│       │   ├── fileUpload.js             # File upload helpers
│       │   ├── validators.js             # Custom validators
│       │   └── logger.js                 # Logging utility
│       │
│       ├── 📁 constants/                 # Application constants
│       │   ├── statusCodes.js            # HTTP status codes
│       │   ├── roles.js                  # User roles
│       │   ├── statuses.js               # Entity statuses
│       │   ├── messages.js               # Response messages
│       │   └── config.js                 # App configuration
│       │
│       └── 📁 uploads/                   # Temporary file uploads
│           └── .gitkeep
│
│
└── 📁 node_modules/                      # Installed dependencies (auto-generated)
    └── ... (413 packages)
```

---

## 📊 File Count Summary

| Component | Count | Status |
|-----------|-------|--------|
| Frontend Configuration Files | 9 | ✅ Complete |
| Frontend Source Files | 1 | ✅ Initialized |
| Backend Configuration Files | 2 | ✅ Complete |
| Backend Model Placeholders | 8 | ✅ Ready |
| Total Project Files | 30+ | ✅ Ready |
| Total Dependencies | 413 | ✅ Installed |

---

## 🎯 Development Priority by Folder

### Phase 1: Core Infrastructure
1. `server/src/models/` - Define all schemas
2. `server/src/controllers/` - Implement handlers
3. `server/src/routes/` - Create API endpoints

### Phase 2: Frontend Foundation
1. `client/src/layouts/` - Build page layouts
2. `client/src/components/ui/` - Create UI components
3. `client/src/pages/auth/` - Implement auth pages

### Phase 3: Feature Modules
1. `client/src/pages/[feature]/` - Build feature pages
2. `client/src/services/` - Add API integration
3. `server/src/services/` - Add business logic

### Phase 4: Polish & Optimization
1. `client/src/components/charts/` - Add visualizations
2. `client/src/utils/` & `server/src/utils/` - Refine utilities
3. Test, optimize, and deploy

---

## 🔗 Key Integration Points

### API Communication Flow
```
Frontend (client/src/services/)
    ↓
Axios Instance (api.ts)
    ↓
REST Endpoints (server/src/routes/)
    ↓
Controllers (server/src/controllers/)
    ↓
Services (server/src/services/)
    ↓
Models (server/src/models/)
    ↓
MongoDB
```

### State Management Flow
```
React Context (client/src/context/)
    ↓
Custom Hooks (client/src/hooks/)
    ↓
Components (client/src/pages/ & components/)
    ↓
API Services (client/src/services/)
```

---

## 📝 Quick Reference

### To add a new feature module:
1. Create model in `server/src/models/`
2. Create routes in `server/src/routes/`
3. Create controller in `server/src/controllers/`
4. Create service in `server/src/services/`
5. Create API service in `client/src/services/`
6. Create pages in `client/src/pages/[feature]/`
7. Create components in `client/src/components/`
8. Add types in `client/src/types/`

---

**Last Updated**: July 12, 2026  
**Status**: Foundation Phase Complete ✅
