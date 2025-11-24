import { Router } from 'express';
import auth from '../../middlewares/auth';
import { ReplyController } from './reply.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createReplyZodSchema, updateReplyZodSchema } from './reply.validation';

const router = Router();

router.use(auth);

router.post('/', validateRequest(createReplyZodSchema), ReplyController.createReply);
router.get('/comment/:commentId', ReplyController.getRepliesByCommentId);
router.patch('/:id', validateRequest(updateReplyZodSchema), ReplyController.updateReply);
router.delete('/:id', ReplyController.deleteReply);

router.post('/:id/like', ReplyController.toggleLike);
router.get('/:id/likes', ReplyController.getReplyLikes);

export const ReplyRoutes = router;
