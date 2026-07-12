# TransFlow - User Guide

## Welcome to TransFlow

TransFlow is a comprehensive fleet management platform designed to digitize and streamline your transport operations. This guide will help you navigate the application and make the most of its features.

## Getting Started

### Accessing the Application

1. Open your web browser
2. Navigate to `http://localhost:5173`
3. You'll see the TransFlow landing page

### Landing Page

The landing page introduces TransFlow's features and benefits:
- **Hero Section**: Main call-to-action buttons (Get Started, Login)
- **Features Section**: Highlights of key capabilities
- **How It Works**: Step-by-step overview of the platform
- **Footer**: Company information

### Authentication

#### Login
1. Click "Login" from the landing page or navbar
2. Enter your email address
3. Enter your password
4. Check "Remember me" if desired
5. Click "Sign In" to proceed

**Demo Credentials (for testing):**
- Email: `admin@transflow.com`
- Password: `demo123`

#### Register
1. Click "Get Started" from the landing page
2. Fill in all required fields:
   - Full Name
   - Email Address
   - Phone Number
   - Password
   - Confirm Password
3. Accept the Terms and Conditions
4. Click "Create Account"

## Main Application

Once logged in, you'll see the main dashboard with:

### Left Sidebar
- **Navigation Menu**: Main modules (Dashboard, Vehicles, Drivers, Trips, Maintenance, Fuel & Expenses, Reports)
- **Secondary Menu**: Notifications, Settings
- **Collapse Button**: Minimize sidebar to save space
- **Logo**: TransFlow branding

### Top Navbar
- **Search Bar**: Quick search across the application
- **Notifications**: View system alerts and updates
- **User Profile**: Account menu with logout option

## Core Modules

### 1. Dashboard

The Dashboard provides a comprehensive overview of your fleet operations.

**Key Metrics (KPI Cards):**
- **Total Vehicles**: Count of all vehicles in your fleet
- **Available Vehicles**: Vehicles ready for deployment
- **Active Trips**: Ongoing deliveries
- **Maintenance Required**: Vehicles needing service
- **Drivers On Duty**: Currently working drivers
- **Fleet Utilization**: Percentage of active vehicles

**Analytics Charts:**
- **Monthly Trips**: Line chart showing trip trends
- **Fuel Expense Trend**: Bar chart of fuel costs

**Recent Activity:**
- Latest fleet operations and updates
- Driver actions and trip completions

### 2. Vehicle Management

Manage your fleet vehicles efficiently.

**Features:**
- **Search**: Find vehicles by registration number or model
- **Add Vehicle**: Create a new vehicle record
  - Registration Number (e.g., TRK-001)
  - Model/Type (Truck, Van, Bike, Taxi)
  - Capacity in kg
  - Current mileage
- **Edit Vehicle**: Update vehicle information
- **Delete Vehicle**: Remove vehicles from system
- **Status Tracking**: View current vehicle status
  - Available: Ready for dispatch
  - On Trip: Currently delivering
  - In Shop: Under maintenance
  - Retired: No longer in use

**Table View:**
- Registration Number
- Model
- Type
- Capacity (kg)
- Mileage (km)
- Current Status
- Quick Actions (Edit/Delete)

### 3. Driver Management

Monitor and manage your driver workforce.

**Features:**
- **Add Driver**: Register new drivers
  - Full Name
  - License Number
  - Phone Number
  - License Expiry Date
- **License Expiry Monitoring**: 
  - Green: License valid for 30+ days
  - Yellow: License expiring within 30 days
  - Red: License already expired
- **Safety Score**: Track driver safety performance (0-100%)
- **Status Management**: Active/Inactive driver tracking

**Alerts:**
- **License Expiring Soon**: Notification for renewals
- **License Expired**: Urgent action required notification

**Table View:**
- Driver Name
- License Number
- Phone
- License Expiry Date
- Safety Score (%)
- Current Status
- Quick Actions

### 4. Trip Management

Plan, dispatch, and track delivery trips.

**Features:**
- **Create Trip**: Plan a new delivery
  - Source location
  - Destination location
  - Vehicle assignment
  - Driver assignment
  - Cargo weight (kg)
  - Distance (km)
- **Trip Status**: Track progress
  - Draft: Not yet dispatched
  - Dispatched: In transit
  - Completed: Delivery finished
  - Cancelled: Trip cancelled
- **Advanced Filtering**: Filter by status, source, destination
- **Analytics**: Total distance and trip counts

**Statistics:**
- Draft trips count
- In-transit trips count
- Completed trips
- Total distance traveled

**Table View:**
- Source & Destination
- Cargo Weight
- Distance
- Vehicle Assigned
- Driver Assigned
- Departure Time
- Trip Status
- Quick Actions

### 5. Maintenance (Coming Soon)

Track vehicle maintenance schedules and service history.

### 6. Fuel & Expenses (Coming Soon)

Monitor fuel consumption and operational expenses.

### 7. Reports (Coming Soon)

Generate comprehensive fleet analytics and reports.

## Navigation Tips

### Using the Sidebar

1. **Expanded View**: Shows full menu labels and icons
2. **Collapsed View**: Click the arrow button to minimize
   - Shows only icons for quick access
   - Hover over icons to see labels
3. **Active Menu**: Current page is highlighted in blue

### Searching

The search bar in the top navbar allows quick searching:
- Type in your search query
- Results update in real-time
- Filters vary by page (vehicles, drivers, trips)

### Creating New Records

1. Click the "Add" button (blue button with + icon)
2. Fill in all required fields
3. Click "Save" to create
4. Click "Cancel" to discard

### Editing Records

1. Click the Edit icon (pencil) in the table row
2. Update the information in the modal
3. Click "Update" to save changes
4. Click "Cancel" to discard

### Deleting Records

1. Click the Delete icon (trash) in the table row
2. Record is immediately removed
3. This action cannot be undone

## Tips & Best Practices

### Dashboard Best Practices
- Check the dashboard daily for fleet overview
- Monitor alerts for urgent actions
- Track utilization trends for efficiency

### Vehicle Management
- Keep vehicle information current
- Update mileage regularly for maintenance tracking
- Monitor vehicle status for dispatch planning

### Driver Management
- Review license expiry dates regularly
- Track safety scores for compliance
- Monitor driver status for availability

### Trip Planning
- Plan trips with accurate source/destination
- Assign appropriate vehicles for cargo type
- Track trip progress for on-time delivery
- Use distance estimates for fuel planning

## Troubleshooting

### Page Not Loading
- Refresh the browser (Ctrl+R or Cmd+R)
- Clear browser cache
- Check internet connection

### Search Not Working
- Ensure you're typing in the search field
- Check spelling and format
- Try different search terms

### Can't Find a Record
- Use the search function
- Check filters are not limiting results
- Verify the record hasn't been deleted

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search | Ctrl+F (Cmd+F on Mac) |
| Refresh | Ctrl+R (Cmd+R on Mac) |
| Navigate Focus | Tab |
| Submit Form | Enter |

## System Requirements

- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet**: Stable connection required
- **Screen**: Minimum 1024px width (desktop optimized)
- **JavaScript**: Must be enabled

## Data Privacy

Your data is secured with industry-standard practices. All vehicle, driver, and trip information is encrypted and protected.

## Support

For technical issues or feature requests, contact the support team or check the system logs for error messages.

## Conclusion

TransFlow is designed to make fleet management simple and efficient. Regular use of all modules will help you optimize operations, reduce costs, and improve service delivery.

**Happy fleet managing with TransFlow!**
