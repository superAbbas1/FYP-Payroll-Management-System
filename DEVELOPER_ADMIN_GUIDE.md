# 👨‍💻 Developer & Admin Guide - Attendance System

## 🔧 Technical Overview

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Employee Dashboard                                 │   │
│  │  ├─ Mark Attendance (MarkAttendance.jsx)            │   │
│  │  ├─ View Attendance History (EmployeeAttendance)    │   │
│  │  └─ Profile (Profile.jsx) - FIXED                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕ API Calls
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes                                              │   │
│  │  ├─ POST /api/attendance (Mark Present)            │   │
│  │  ├─ GET /api/attendance/:employeeId (History)      │   │
│  │  ├─ GET /api/employee-attendance-today             │   │
│  │  ├─ POST /api/auto-mark-absent (Manual trigger)    │   │
│  │  └─ GET /api/user/:employeeID (Profile - FIXED)    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Cron Job                                            │   │
│  │  ├─ Runs: Daily at 11:59 PM (23:59)                │   │
│  │  └─ Action: Auto-mark Absent                       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↕ Queries
┌─────────────────────────────────────────────────────────────┐
│                 DATABASE (MongoDB)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collection: AttendanceHistory                      │   │
│  │  ├─ employeeId (String)                             │   │
│  │  ├─ date (String: YYYY-MM-DD)                       │   │
│  │  ├─ status (String: 'Present' or 'Absent')          │   │
│  │  ├─ year (Number)                                   │   │
│  │  └─ month (Number)                                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### AttendanceHistory Collection

```javascript
{
  _id: ObjectId,
  employeeId: String,      // Reference to employee ID (e.g., "EMP001")
  date: String,            // ISO format: "2024-01-18"
  status: String,          // Enum: 'Present' | 'Absent'
  year: Number,            // 2024, 2025, etc.
  month: Number,           // 1-12
  createdAt: Timestamp,    // Auto-generated
  updatedAt: Timestamp     // Auto-generated
}
```

### Example Records

```javascript
// When employee marks Present at 9:15 AM
{
  _id: ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  employeeId: "EMP001",
  date: "2024-01-18",
  status: "Present",
  year: 2024,
  month: 1
}

// When system auto-marks absent at 11:59 PM
{
  _id: ObjectId("65a1b2c3d4e5f6g7h8i9j0k2"),
  employeeId: "EMP002",
  date: "2024-01-18",
  status: "Absent",
  year: 2024,
  month: 1
}
```

---

## 🔌 API Endpoints

### 1. Mark Attendance - POST `/api/attendance`

**Purpose**: Employee marks themselves as Present

**Request**:
```json
{
  "employeeId": "65a0b1c2d3e4f5g6h7i8j9k0",
  "date": "2024-01-18",
  "status": "Present"
}
```

**Response (Success)**:
```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "employeeId": "EMP001",
    "date": "2024-01-18",
    "status": "Present",
    "year": 2024,
    "month": 1
  }
}
```

**Error Cases**:
- Missing employeeId: 500 error
- Invalid date format: 500 error
- Database error: 500 error

---

### 2. Get Today's Attendance - GET `/api/employee-attendance-today`

**Purpose**: Check if employee already marked attendance today

**Query Parameters**:
```
?employeeId=65a0b1c2d3e4f5g6h7i8j9k0&date=2024-01-18
```

**Response (Already Marked)**:
```json
{
  "message": "Attendance is registered for date: 2024-01-18",
  "attendanceMarked": true,
  "status": "Present"
}
```

**Response (Not Marked)**:
```json
{
  "message": "Attendance is not registered yet for date: 2024-01-18",
  "attendanceMarked": false
}
```

---

### 3. Get Attendance History - GET `/api/attendance/:employeeId`

**Purpose**: Get all attendance records for an employee for a specific month

**Query Parameters**:
```
?targetYear=2024&targetMonth=1
```

**Response**:
```json
[
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "employeeId": "EMP001",
    "date": "2024-01-18",
    "status": "Present",
    "year": 2024,
    "month": 1
  },
  {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "employeeId": "EMP001",
    "date": "2024-01-17",
    "status": "Absent",
    "year": 2024,
    "month": 1
  }
]
```

---

### 4. Manual Auto-Mark Absent - POST `/api/auto-mark-absent`

**Purpose**: Manually trigger the auto-absent marking process

**Request Body**: None (empty body)

**Response**:
```json
{
  "message": "Auto-absent marking completed",
  "absentsMarked": 3,
  "alreadyMarked": 7,
  "totalEmployees": 10,
  "date": "2024-01-18"
}
```

**What it does**:
1. Gets current date
2. Fetches all employees
3. For each employee, checks if they have attendance for today
4. If no attendance exists, creates an "Absent" record
5. Returns summary of what was processed

---

### 5. Get User Profile - GET `/api/user/:employeeID` (UPDATED)

**Purpose**: Get employee profile information (FIXED for both _id and employeeID)

**Parameter**: `:employeeID` (can be MongoDB _id or employeeID string)

**Response**:
```json
{
  "fname": "John",
  "lname": "Doe",
  "department": "Sales",
  "designation": "Manager",
  "city": "Karachi",
  "phoneNum": "03001234567",
  "bankName": "Allied Bank",
  "accountName": "John Doe",
  "accountNum": "1234567890",
  "cnic": "12345-1234567-1",
  "joining": "2023-01-15",
  "email": "john@company.com",
  "address": "123 Street, Karachi",
  "status": "Active"
}
```

---

## ⏰ Cron Job Configuration

### Current Schedule

```javascript
cron.schedule('59 23 * * *', async () => {
  // Runs every day at 11:59 PM
});
```

### Cron Expression Explained

```
59 23 * * *
 │  │ │ │ └─── Day of week (0-6, 0 = Sunday) - * = every day
 │  │ │ └───── Month (1-12) - * = every month
 │  │ └─────── Date (1-31) - * = every date
 │  └───────── Hour (0-23) - 23 = 11 PM
 └──────────── Minute (0-59) - 59 = 59 minutes
```

### To Change Schedule

Edit `backend/index.js`, find the cron.schedule line and modify:

```javascript
// Run at 12:00 AM (midnight)
cron.schedule('0 0 * * *', async () => { ... });

// Run at 5:00 PM every day
cron.schedule('0 17 * * *', async () => { ... });

// Run every 6 hours
cron.schedule('0 */6 * * *', async () => { ... });

// Run Monday-Friday only at 9 AM
cron.schedule('0 9 * * 1-5', async () => { ... });
```

### Monitoring Cron Job

Check console logs for cron job execution:

```javascript
// In backend index.js, logs show:
console.log('Running scheduled auto-mark absent job...');
console.log(`✓ Auto-mark absent completed: X employees marked as absent for DATE`);
```

---

## 🚀 Deployment Checklist

### Prerequisites
- Node.js installed
- MongoDB connection string configured in .env
- All dependencies installed

### Backend Deployment

```bash
# 1. Install dependencies
cd backend
npm install

# 2. Check environment variables
# Verify .env has:
#   - MONGO_URI=mongodb+srv://...
#   - PORT=5000 (or desired port)

# 3. Start server
npm start

# Expected output:
# ✅ MongoDB Connected
# 🚀 Server started on port 5000
```

### Frontend Deployment

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Start development server
npm start

# Or build for production
npm run build

# Expected: App runs on http://localhost:3000
```

### Verification

```javascript
// Test endpoints with Postman or curl:

// 1. Test auto-mark-absent endpoint
POST http://localhost:5000/api/auto-mark-absent

// 2. Check if records were created
GET http://localhost:5000/api/attendance/EMPLOYEE_ID?targetYear=2024&targetMonth=1

// 3. Test profile endpoint with employeeID
GET http://localhost:5000/api/user/EMPLOYEE_ID_STRING
```

---

## 🐛 Debugging

### Common Issues

#### 1. Cron job not running
**Check**:
```bash
# Verify in backend console output for cron logs
# Should see "Running scheduled auto-mark absent job..." at 11:59 PM

# If not appearing:
1. Check server is running continuously (not stopped)
2. Verify system time is correct
3. Check MongoDB connection is active
4. Look for errors in console
```

#### 2. Profile data not displaying
**Check**:
```bash
# Test endpoint directly:
GET /api/user/EMPLOYEE_ID

# Verify:
1. employeeId format is correct
2. Employee exists in database
3. No typos in parameter
4. MongoDB connection working
```

#### 3. Attendance not saving
**Check**:
```bash
# Verify POST request body:
{
  "employeeId": "CORRECT_FORMAT",
  "date": "2024-01-18",  // Must be YYYY-MM-DD
  "status": "Present"
}

# If still failing:
1. Check MongoDB is running
2. Verify User model has correct employeeID field
3. Check network connection to backend
```

#### 4. Auto-absent not triggering
**Check**:
1. Backend server is still running (verify no restart)
2. Current time is 11:59 PM or later
3. Check MongoDB connection
4. Manually call `/api/auto-mark-absent` to test

### Enable Debug Logging

Add to `backend/index.js`:

```javascript
// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Log cron job execution
cron.schedule('59 23 * * *', async () => {
  console.log('=== CRON JOB START ===');
  // ... rest of code
  console.log('=== CRON JOB END ===');
});
```

---

## 📊 Monitoring & Analytics

### Useful Queries

```javascript
// MongoDB queries to monitor attendance

// Total attendance marked today
db.AttendanceHistory.find({
  date: "2024-01-18"
}).count()

// Present vs Absent split
db.AttendanceHistory.aggregate([
  { $match: { date: "2024-01-18" } },
  { $group: { _id: "$status", count: { $sum: 1 } } }
])

// Employee's attendance history
db.AttendanceHistory.find({
  employeeId: "EMP001"
}).sort({ date: -1 })

// Monthly attendance summary
db.AttendanceHistory.aggregate([
  { $match: { year: 2024, month: 1 } },
  { 
    $group: { 
      _id: "$employeeId",
      presentDays: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
      absentDays: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } }
    }
  }
])
```

---

## 🔐 Security Notes

1. **Validate employeeId**: Always validate that the employee making the request is authorized
2. **Date Format**: Enforce YYYY-MM-DD format to prevent injection
3. **Status Enum**: Only allow 'Present' and 'Absent' values
4. **Rate Limiting**: Consider adding rate limits to POST endpoints
5. **Error Messages**: Don't expose sensitive database info in error responses

---

## 📈 Performance Considerations

### Optimization Tips

1. **Indexing**: Add MongoDB indexes on frequently queried fields
   ```javascript
   db.AttendanceHistory.createIndex({ employeeId: 1, date: 1 });
   db.AttendanceHistory.createIndex({ date: 1 });
   ```

2. **Caching**: Cache attendance data for quick retrieval
3. **Pagination**: Implement pagination for large result sets
4. **Batch Operations**: Use batch insert when marking multiple absents

---

## 📞 Maintenance

### Regular Tasks

- [ ] Monitor cron job execution logs daily
- [ ] Check database size and backup regularly
- [ ] Review error logs weekly
- [ ] Test manual auto-mark-absent monthly
- [ ] Verify employee count for attendance consistency
- [ ] Archive old attendance records annually

---

**System is production-ready. Happy deploying! 🚀**
