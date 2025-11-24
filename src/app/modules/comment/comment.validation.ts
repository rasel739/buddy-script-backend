import z from 'zod';

export const createCommentZodSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required').max(2000),
    postId: z.string({ error: 'Invalid post ID' }),
  }),
});

export const updateCommentZodSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(2000),
  }),
});

export const CommentValidation = {
  createCommentZodSchema,
  updateCommentZodSchema,
};
