import { z } from 'zod';

const userZodSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string({ error: 'Email is required' }),
    password: z.string().min(6, 'Password must be at least 6 characters'),
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
