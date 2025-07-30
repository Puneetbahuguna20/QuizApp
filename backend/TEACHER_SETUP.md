# Teacher Account Setup

This document explains how to set up the teacher account in the database for the Quizzzz application.

## Overview

The application now stores the teacher account in the MongoDB database instead of hardcoding it in the frontend. This allows for more secure and flexible management of teacher accounts.

## Default Teacher Account

The default teacher account has the following credentials:

- Email: `teacher@123gmail.com`
- Password: `teacher123`
- Role: `teacher`

## Setting Up the Teacher Account

To set up the teacher account in the database, follow these steps:

1. Make sure MongoDB is running and accessible.
2. Make sure the `.env` file in the backend directory has the correct `MONGO_URL` value.
3. Run the following command from the backend directory:

```bash
npm run seed-teacher
```

This command will check if the teacher account already exists in the database. If it doesn't, it will create it.

## Adding More Teacher Accounts

To add more teacher accounts, you have two options:

### Option 1: Modify the seedTeacher.js file

You can modify the `seedTeacher.js` file to add more teacher accounts. Simply add more teacher objects to the script and run it again.

### Option 2: Use the Registration API

You can use the registration API to create new teacher accounts. Make sure to set the `role` field to `teacher` when registering a new user.

```json
{
  "name": "New Teacher",
  "email": "newteacher@example.com",
  "password": "password123",
  "role": "teacher"
}
```

## Troubleshooting

If you encounter any issues with the teacher account setup, check the following:

1. Make sure MongoDB is running and accessible.
2. Check the MongoDB connection string in the `.env` file.
3. Check the console output for any error messages.
4. Verify that the teacher account was created successfully by checking the MongoDB database.