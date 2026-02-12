# LearnHub_1 - Online Learning Platform

A full-stack MERN Online Learning Platform with Role-Based Access Control (Admin, Teacher, Student).

## Features
- **User Authentication**: Secure Login/Register with JWT & Role Management.
- **Admin Dashboard**: Overview of system.
- **Teacher Dashboard**: Create, Update, Delete Courses.
- **Student Dashboard**: Browse courses, Enroll, Track Progress.
- **Course Management**: Add sections, set prices, categories.

## Tech Stack
- **Frontend**: React, Vite, Bootstrap, Material UI, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT

## Prerequisites
- Node.js installed
- MongoDB URI (in `.env`)

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
# Ensure .env file has MONGO_URI and JWT_SECRET
npm start
```
Server runs on http://localhost:5000

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Client runs on http://localhost:5173

## Folder Structure
- `backend/`: Server, API Routes, Controllers, Models.
- `frontend/`: React components, Pages, Auth Context.

## API Endpoints
- `POST /api/auth/register` - Register User
- `POST /api/auth/login` - Login User
- `GET /api/courses` - Get All Courses
- `POST /api/courses` - Create Course (Teacher/Admin)
- `POST /api/courses/:id/enroll` - Enroll in Course (Student)
