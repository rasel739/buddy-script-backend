import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PostValidation } from './post.validation';
import { PostController } from './post.controller';
import { uploadSingle } from '../../middlewares/uploadMulter';

const router = Router();

// Protect all routes after this middleware

router.use(auth);

router.post(
  '/',
  uploadSingle,
  validateRequest(PostValidation.createPostZodSchema),
  PostController.createPost
);

router.get('/feed', PostController.getPostFeed);

router.get('/:id', PostController.getPostById);
router.patch(
  '/:id',
  validateRequest(PostValidation.updatePostZodSchema),
  PostController.updatePost
);
router.delete('/:id', PostController.deletePost);

router.post('/:id/like', PostController.toggleLike);
router.get('/:id/likes', PostController.getPostLikes);

export const PostRoutes = router;
