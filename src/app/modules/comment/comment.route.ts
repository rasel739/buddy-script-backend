import { Router } from 'express';
import auth from '../../middlewares/auth';
import { CommentController } from './comment.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createCommentZodSchema, updateCommentZodSchema } from './comment.validation';

const router = Router();

router.use(auth);

router.post('/', validateRequest(createCommentZodSchema), CommentController.createComment);
router.get('/post/:postId', CommentController.getCommentsByPostId);
router.patch('/:id', validateRequest(updateCommentZodSchema), CommentController.updateComment);
router.delete('/:id', CommentController.deleteComment);

router.post('/:id/like', CommentController.toggleLike);
router.get('/:id/likes', CommentController.getCommentLikes);

export const CommentRoutes = router;
