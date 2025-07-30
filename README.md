# Quizzzz Application

## Overview

Quizzzz is a quiz application that allows teachers to create quizzes and students to take them. The application has two main roles:

- **Teacher**: Can create quizzes, view results, and manage the application.
- **Student**: Can take quizzes and view their results.

## Project Structure

The project is divided into two main parts:

- **Backend**: Node.js, Express, and MongoDB
- **Frontend**: React, TypeScript, and Vite

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the backend directory with the following variables:
     ```
     MONGO_URL=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     PORT=3001
     ```
   - Create a `.env` file in the frontend directory with the following variables:
     ```
     VITE_API_URL=http://localhost:3001/api
     ```

4. Set up the teacher account (see [Teacher Account Setup](#teacher-account-setup))

### Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm run dev
```

## Teacher Account Setup

The application now stores the teacher account in the MongoDB database instead of hardcoding it in the frontend. To set up the teacher account, follow these steps:

1. Make sure MongoDB is running and accessible.
2. Make sure the `.env` file in the backend directory has the correct `MONGO_URL` value.
3. Run the following command from the backend directory:

```bash
npm run seed-teacher
```

This command will check if the teacher account already exists in the database. If it doesn't, it will create it with the following credentials:

- Email: `teacher@123gmail.com`
- Password: `teacher123`
- Role: `teacher`

For more details on teacher account setup, see the [TEACHER_SETUP.md](backend/TEACHER_SETUP.md) file.

## Features

- User authentication (login, register, logout)
- Role-based access control (teacher, student)
- Quiz creation and management (for teachers)
- Quiz taking and result viewing (for students)

## License

This project is licensed under the MIT License.