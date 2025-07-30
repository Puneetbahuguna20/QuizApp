import { z } from "zod";

// Zod schemas for validation
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is Required').refine(
    (email) => {
      // Allow teacher shortcuts or valid email format
      return email === 'teacher@123gmail.com' || 
             email === 'teacher@31gmail.com' || 
             /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    'Please enter valid email'
  ),
  password: z.string().min(1, 'Password is Required'),
});

export const registerSchema = z.object({
  name: z.string().min(3, 'Min Len of Name is 3 chars long').max(10, 'Max Len of Name is 10 chars'),
  email: z.string().min(1, 'Email is Required').email('Please enter valid email'),
  password: z.string().min(8, 'Password must be min 8 chars').max(20, 'Password must be not more than 20 chars'),
  role: z.string().refine((val) => val === 'student' || val === 'teacher', {
    message: 'Please select either student or teacher',
  }),
});

// TypeScript types for form data
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;