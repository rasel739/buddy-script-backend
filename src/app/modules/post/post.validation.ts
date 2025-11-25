import z from 'zod';

const createPostZodSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required').max(5000),
    imageUrl: z.string().optional(),
    isPrivate: z
      .union([z.string(), z.boolean()])
      .optional()
      .transform((val) => {
        if (typeof val === 'boolean') return val;
        return val === 'true';
      }),
  }),
});

export const updatePostZodSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(5000).optional(),
    isPrivate: z.boolean().optional(),
  }),
});

export const PostValidation = {
  createPostZodSchema,
  updatePostZodSchema,
};
