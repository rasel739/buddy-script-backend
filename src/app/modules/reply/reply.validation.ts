import z from 'zod';

export const createReplyZodSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Content is required').max(2000),
    commentId: z.string({ error: 'Invalid comment ID' }),
  }),
});

export const updateReplyZodSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(2000),
  }),
});

export const ReplyValidation = {
  createReplyZodSchema,
  updateReplyZodSchema,
};
