import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { CommentService } from './comment.service';
import sendResponse from '../../../shared/sendResponse';
import { ICommentResponse } from '../../../interface/common';

const createComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await CommentService.createComment(id, req.body);

  sendResponse<ICommentResponse>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'comment successfully',
    data: result,
  });
});

const getCommentsByPostId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };

  const result = await CommentService.getCommentsByPostId(req.params.postId as string, id);

  sendResponse<ICommentResponse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'comment get successfully',
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };

  const result = await CommentService.updateComment(req.params.id as string, id, req.body);

  sendResponse<ICommentResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated successfully',
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await CommentService.deleteComment(req.params.id as string, id);
  sendResponse<{ message: string }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment delete successfully',
    data: result,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await CommentService.toggleLike(req.params.id as string, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

const getCommentLikes = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await CommentService.getCommentLikes(req.params.id as string, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

export const CommentController = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
  toggleLike,
  getCommentLikes,
};
