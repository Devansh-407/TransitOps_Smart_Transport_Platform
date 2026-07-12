export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'fleet_manager' | 'driver' | 'safety_officer' | 'financial_analyst';
  avatar?: string;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  type: 'truck' | 'van' | 'bike' | 'taxi';
  capacity: number;
  status: 'available' | 'on_trip' | 'in_shop' | 'retired';
  mileage: number;
  createdAt: Date;
}

export interface Driver {
  id: string;
  fullName: string;
  licenseNumber: string;
  phone: string;
  licenseExpiry: Date;
  safetyScore: number;
  status: 'active' | 'inactive' | 'on_leave';
  createdAt: Date;
}

export interface Trip {
  id: string;
  source: string;
  destination: string;
  vehicleId: string;
  driverId: string;
  cargoWeight: number;
  distance: number;
  status: 'draft' | 'dispatched' | 'completed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  createdAt: Date;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: string;
  cost: number;
  date: Date;
  description: string;
  createdAt: Date;
}

export interface FuelLog {
  id: string;
  vehicleId: string;
  liters: number;
  cost: number;
  date: Date;
  mileage: number;
  createdAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
