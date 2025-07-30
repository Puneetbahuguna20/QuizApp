# Authentication Flow Documentation

## Overview
This project implements a complete authentication system using React + TypeScript with the following technologies:

- **React Hook Form** - Form handling and validation
- **Zod** - Schema validation
- **Axios** - API calls
- **React Router** - Navigation and protected routes
- **Context API** - State management

## Project Structure

```
src/
├── components/
│   └── ProtectedRoute.tsx          # Protected route wrapper
├── contexts/
│   └── AuthContext.tsx             # Authentication context
├── lib/
│   └── validation.ts               # Zod validation schemas
├── pages/
│   ├── Login.tsx                   # Login form
│   ├── Register.tsx                # Registration form
│   └── Dashboard.tsx               # Protected dashboard
├── services/
│   └── api.ts                      # API service layer
└── shared/assets/
    └── AppRoutes.tsx               # Route configuration
```

## Features

### ✅ Authentication Flow
- User registration with validation
- User login with validation
- Protected routes
- Automatic token management
- Logout functionality

### ✅ Form Validation
- **Registration**: Name (3-10 chars), Email, Password (8-20 chars), Confirm Password
- **Login**: Email, Password (any length)
- Real-time validation with Zod schemas
- Custom error messages

### ✅ API Integration
- Centralized API service with Axios
- Request/response interceptors
- Automatic token handling
- Error handling

### ✅ User Experience
- Loading states
- Error messages
- Navigation between auth pages
- Redirect after successful auth
- Remember intended destination

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000/api
```

### 2. API Endpoints
The authentication system expects these API endpoints:

```typescript
// POST /api/auth/register
{
  name: string;
  email: string;
  password: string;
}

// POST /api/auth/login
{
  email: string;
  password: string;
}

// GET /api/auth/me
// Returns current user info

// POST /api/auth/logout
// Logs out user
```

### 3. Response Format
API responses should follow this format:
```typescript
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
```

## Usage

### Login Flow
1. User visits `/login`
2. Fills in email and password
3. Form validates input using Zod
4. On submit, calls API
5. On success, stores token and redirects to dashboard
6. On error, displays error message

### Registration Flow
1. User visits `/register`
2. Fills in name, email, password, confirm password
3. Form validates input using Zod
4. On submit, calls API
5. On success, stores token and redirects to dashboard
6. On error, displays error message

### Protected Routes
- `/dashboard` - Requires authentication
- Unauthenticated users are redirected to `/login`
- Authenticated users are redirected to `/dashboard` when visiting `/login` or `/register`

## Customization

### Validation Rules
Edit `src/lib/validation.ts` to modify validation rules:

```typescript
export const registerSchema = z.object({
  name: z.string().min(3, 'Min Len of Name is 3 chars long').max(10, 'Max Len of Name is 10 chars'),
  email: z.string().min(1, 'Email is Required').email('Please enter valid email'),
  password: z.string().min(8, 'Password must be min 8 chars').max(20, 'Password must be not more than 20 chars'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
});
```

### API Configuration
Edit `src/services/api.ts` to modify API settings:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

### Styling
The components use Tailwind CSS classes and can be customized by modifying the className props.

## Error Handling

The system handles various error scenarios:
- Network errors
- API validation errors
- Authentication errors
- Form validation errors

All errors are displayed to the user with appropriate messages.

## Security Features

- Token-based authentication
- Automatic token refresh (can be extended)
- Protected routes
- Secure password validation
- CSRF protection (via Axios interceptors) 