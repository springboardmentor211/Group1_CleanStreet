# Admin Dashboard Setup Guide

## Overview
The Admin Dashboard has been successfully created with the following features:
- System Overview with key metrics
- Complaint management and status updates
- User management and activity monitoring
- Report generation capabilities

## Files Created

### Frontend Components
- `client/src/pages/Admin/AdminDashboardPage.jsx` - Main admin dashboard component
- `client/src/pages/Admin/AdminDashboard.css` - Styling for admin dashboard
- Updated `client/src/App.jsx` - Added admin route/mode

### Backend Routes
- `server/routes/adminRoutes.js` - All admin API endpoints

## Setup Instructions

### 1. Create an Admin User

To create an admin user and test the dashboard, you need to:

#### Option A: Using MongoDB Compass (Recommended)
1. Open MongoDB Compass and connect to your database
2. Navigate to the `users` collection
3. Insert a new document with the following structure:
```json
{
  "name": "Admin User",
  "email": "admin@cleanstreet.com",
  "phone": "+1234567890",
  "password": "your_hashed_password",
  "role": "admin",
  "avatar": "",
  "createdAt": {
    "$date": "2024-01-01T00:00:00Z"
  },
  "updatedAt": {
    "$date": "2024-01-01T00:00:00Z"
  }
}
```

#### Option B: Using Node.js Script
Create a temporary script in the server directory to hash and create an admin user:

```javascript
// server/createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = new User({
      name: "Admin User",
      email: "admin@cleanstreet.com",
      phone: "+1234567890",
      password: hashedPassword,
      role: "admin",
      avatar: ""
    });
    
    await admin.save();
    console.log("✅ Admin user created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
```

Then run: `node createAdmin.js`

### 2. Access the Admin Dashboard

1. Start your server: `npm start` (in server directory)
2. Start your client: `npm run dev` (in client directory)
3. Navigate to the login page
4. Login with admin credentials:
   - Email: `admin@cleanstreet.com`
   - Password: `admin123` (or your custom password)

Upon successful login, you'll be directed to the admin dashboard instead of the regular user home page.

### 3. Dashboard Features

#### Overview Tab
- View key system metrics
- Total complaints count
- Pending review count
- Active users count
- Resolved complaints (today)
- Community impact summary

#### Manage Complaints Tab
- View all complaints submitted by users
- Filter complaints by status:
  - All
  - Pending
  - In Progress
  - Resolved
  - Rejected
- Quick status update from dropdown
- View complaint images and details

#### Users Tab
- List all registered users
- View user information:
  - Name
  - Email
  - Number of complaints submitted
  - Account creation date
  - Account status

#### Reports Tab
- Generate various system reports:
  - System Report - Complete overview
  - Complaint Analytics - Detailed analysis by category and status
  - User Activity Report - User engagement metrics
  - Geographic Distribution - Issues by location

## API Endpoints

### Statistics
```
GET /api/admin/stats
```
Returns system overview metrics.

### Complaints Management
```
GET /api/admin/complaints
```
Get all complaints with user information.

```
PUT /api/admin/complaints/:id
Body: { "status": "resolved|in_progress|pending|rejected" }
```
Update complaint status.

### Users Management
```
GET /api/admin/users
```
Get all users with complaint count.

### Analytics
```
GET /api/admin/analytics
```
Get data grouped by status, category, and date for analysis.

### Report Generation
```
GET /api/admin/report/generate
```
Generate and download a text report (PDF generation can be enhanced with additional libraries).

## Security Considerations

⚠️ **Important**: The current implementation does not have authentication middleware. For production, add:

1. **JWT-based Authentication**: Verify admin tokens on protected routes
2. **Role-based Access Control**: Add middleware to check `role: "admin"`
3. **Rate Limiting**: Prevent abuse of admin endpoints
4. **Audit Logging**: Log all admin actions

### Example Middleware (Add to adminRoutes.js)
```javascript
const authMiddleware = (req, res, next) => {
  // Check if user has admin token/role
  // Verify JWT and role before allowing access
  next();
};

router.use(authMiddleware);
```

## Testing Checklist

- [ ] Admin user successfully created
- [ ] Admin login works correctly
- [ ] Overview tab displays stats
- [ ] Can view and filter complaints
- [ ] Status update works for complaints
- [ ] Users list displays correctly
- [ ] Report generation downloads file
- [ ] Navigation between tabs works
- [ ] Logout functionality works

## Customization Options

### Change Dashboard Statistics
Modify `AdminDashboardPage.jsx` `fetchStats()` function to adjust what metrics are displayed.

### Add Custom Reports
Edit the `adminRoutes.js` `/api/admin/report/generate` endpoint to create custom report formats.

### Update Styling
Modify `AdminDashboard.css` to match your brand colors and design system.

## Troubleshooting

### Admin Dashboard Not Loading
- Verify user role is set to "admin" in database
- Check browser console for API errors
- Ensure server is running on port 5000

### Can't Login with Admin Credentials
- Verify admin user exists in database
- Check password is hashed (if using MongoDB directly)
- Review server logs for authentication errors

### Report Generation Fails
- Ensure all necessary data exists in database
- Check server has write permissions for file download
- Verify database connection is active

## Next Steps

1. Test the admin dashboard with sample data
2. Implement JWT authentication middleware
3. Add additional report types and visualizations
4. Set up role-based access control throughout the app
5. Create audit logging for admin actions
6. Add email notifications for critical changes
