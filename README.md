# Payroll Management System

A full-stack payroll management system built for a final year project. It helps an organization manage employees, departments, attendance, salary records, provident fund details, loans, leave requests, and basic account access for both admin and employee users.

## Project Overview

The system has two main sides:

- **Admin side:** manage employees, departments, designations, attendance records, salary updates, salary history, provident fund records, loan requests, and leave requests.
- **Employee side:** view profile, mark and view attendance, view salary and provident fund details, request provident fund loans, submit leave requests, and change password.

The frontend is built with React, and the backend uses Node.js, Express, and MongoDB.

## Key Features

- Admin and employee login flow
- Employee registration and employee list management
- Department and designation management
- Attendance marking and attendance history
- Salary editing and salary history view
- Provident fund calculation and yearly/monthly records
- Loan request submission, approval, rejection, and deletion
- Leave request submission, status management, and deletion
- Employee profile and password update
- Email support for account credentials and password recovery
- Smooth frontend message notifications instead of browser alerts

## Tech Stack

**Frontend**

- React
- React Router
- Axios
- React Modal
- React DatePicker
- Chart.js
- CSS

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemailer
- node-cron
- CryptoJS / bcrypt

## Folder Structure

```text
FYP-Payroll/
  backend/       Express API, database models, routes, controllers, helpers
  frontend/      React app, pages, components, styles, routing
  README.md      Project documentation
```

## Main Modules

**Admin Modules**

- Dashboard
- Employee registration
- Employee list and edit employee
- Manage departments and designations
- View and edit attendance
- Edit salary
- View salary
- View provident funds
- Manage loan requests
- Manage leave requests

**Employee Modules**

- Dashboard
- Profile
- Mark attendance
- View attendance
- View salary
- View provident fund details
- Provident fund loan request
- Leave request
- Change password

## Backend API Areas

The backend is organized around these route groups:

- Users and authentication
- Departments and designations
- Attendance
- Salary
- Provident fund
- Loans
- Leaves

## Setup

Install dependencies separately for backend and frontend.

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

Create a backend `.env` file if needed for local configuration such as MongoDB and email settings.

## Running The Project

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm start
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Build

To create a production frontend build:

```bash
cd frontend
npm run build
```

## Notes

- MongoDB should be running before using database features.
- The backend starts on localhost by default.
- Some routes still keep backward-compatible URL patterns for older frontend calls.
- This project is intended for academic/final-year-project use and can be extended for production needs.
