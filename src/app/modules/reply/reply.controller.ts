import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { ReplyService } from './reply.service';
import { IReplyResponse } from '../../../interface/common';
import sendResponse from '../../../shared/sendResponse';

const createReply = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await ReplyService.createReply(id, req.body);

  sendResponse<IReplyResponse>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Reply created successfully',
    data: result,
  });
});

const getRepliesByCommentId = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await ReplyService.getRepliesByCommentId(req.params.commentId as string, id);

  sendResponse<IReplyResponse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

const updateReply = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await ReplyService.updateReply(req.params.commentId as string, id, req.body);

  sendResponse<IReplyResponse>(res, {
    statusCode: httpStatus.OK,
    message: 'Reply updated successfully',
    success: true,
    data: result,
  });
});

const deleteReply = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await ReplyService.deleteReply(req.params.id as string, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Reply delete successfully',
    success: true,
    data: result,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await ReplyService.toggleLike(req.params.id as string, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

const getReplyLikes = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await ReplyService.toggleLike(req.params.id as string, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

export const ReplyController = {
  createReply,
  updateReply,
  deleteReply,
  getRepliesByCommentId,
  getReplyLikes,
  toggleLike,
};
