# TransFlow - Smart Transport Operations Platform

Enterprise-level Fleet and Transport Operations Management System built with MERN stack.

## 📋 Project Overview

TransFlow is a comprehensive SaaS solution designed to digitize transport company operations and replace manual, Excel-based fleet management systems.

### Key Features
- Vehicle Management
- Driver Management
- Trip Dispatching
- Maintenance Tracking
- Fuel & Expense Management
- Fleet Analytics & Reports
- Multi-role Access Control

## 🏗️ Project Architecture

### Monorepo Structure
```
TransFlow/
├── client/          # Frontend - React + Vite
├── server/          # Backend - Express.js
├── package.json     # Root workspace configuration
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS
- ShadCN UI Components
- React Router v6
- Axios for API calls
- React Hook Form + Zod Validation
- Recharts for visualizations
- Lucide React Icons
- Framer Motion for animations

### Backend
- Node.js + Express.js
- JavaScript
- REST API Architecture
- JWT Authentication
- bcrypt for password hashing
- MongoDB + Mongoose ODM
- Multer for file uploads
- Express Validator for validation

### Database
- MongoDB (primary data store)
- Mongoose ODM

### Additional Services
- Cloudinary (file/image uploads)
- Socket.io (for future real-time features)

## 👥 User Roles

1. **Admin** - Full system access, user & resource management
2. **Fleet Manager** - Manage fleet, vehicles, trips, maintenance
3. **Driver** - View assigned trips, update progress
4. **Safety Officer** - Monitor driver licenses and safety scores
5. **Financial Analyst** - Track expenses and operational costs

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB instance
- pnpm or npm

### Installation

1. **Clone and navigate to project**
```bash
cd TransFlow
```

2. **Install dependencies**
```bash
pnpm install
# or
npm install
```

3. **Setup environment variables**
Create `.env` files in both `client` and `server` directories as per `.env.example`

4. **Start development**
```bash
# Run both client and server
pnpm run dev

# Or separately
pnpm run dev:client
pnpm run dev:server
```

### Build for Production
```bash
pnpm run build
```

## 📁 Folder Structure

### Frontend (`client/src/`)
- `assets/` - Images, icons, static files
- `components/` - Reusable UI components
  - `common/` - Layout, headers, navigation
  - `ui/` - UI primitives
  - `charts/` - Chart components
- `layouts/` - Page layouts
- `pages/` - Page components by feature
- `routes/` - Routing configuration
- `services/` - API service layer
- `hooks/` - Custom React hooks
- `context/` - React Context for state management
- `utils/` - Utility functions
- `types/` - TypeScript type definitions
- `constants/` - Application constants

### Backend (`server/src/`)
- `config/` - Database and external service configurations
- `controllers/` - Request handlers
- `models/` - Mongoose schemas
- `routes/` - API route definitions
- `services/` - Business logic layer
- `middleware/` - Express middleware
- `validators/` - Request validation schemas
- `utils/` - Utility functions
- `constants/` - Application constants
- `uploads/` - Temporary file storage

## 📚 Development Roadmap

### Phase 1: Foundation (Current)
- ✅ Project structure initialization
- ✅ Workspace configuration
- ⏳ Authentication system (JWT)
- ⏳ User management module

### Phase 2: Core Modules
- Vehicle management system
- Driver management system
- Trip dispatching system

### Phase 3: Operations
- Maintenance tracking
- Fuel management
- Expense tracking

### Phase 4: Analytics
- Fleet performance dashboards
- Reporting system
- Real-time notifications

## 🔒 Security Considerations

- JWT-based authentication
- Role-Based Access Control (RBAC)
- Input validation and sanitization
- Password hashing with bcrypt
- Secure environment variables
- CORS protection
- Rate limiting (to be implemented)

## 📝 Coding Standards

- Clean Architecture principles
- Modular component structure
- Separation of concerns
- Reusable components
- Meaningful naming conventions
- Environment-based configuration
- Error handling and logging

## 🤝 Contributing

Please follow the established coding standards and folder structure when adding new features.

## 📄 License

MIT License - See LICENSE file for details

## 📧 Contact

For questions or support, contact the TransFlow team.

---

**Last Updated**: July 2026  
**Current Status**: Foundation Phase - Ready for Feature Development
