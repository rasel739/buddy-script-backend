import { z } from 'zod';

export const userZodSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'First name is required').max(100),
    email: z.string('Email address is required'),
    password: z.string().min(6, 'Password must be at least 8 characters'),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({ error: 'Email is required' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const AuthValidation = {
  userZodSchema,
  loginZodSchema,
};
