import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { PostRoutes } from '../modules/post/post.route';
import { CommentRoutes } from '../modules/comment/comment.route';

const router = express.Router();

const moduleRoutes = [
  // route modules will be added here
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/post',
    route: PostRoutes,
  },
  {
    path: '/comment',
    route: CommentRoutes,
  },
];

moduleRoutes.forEach((routes) => router.use(routes.path, routes.route));

export default router;
