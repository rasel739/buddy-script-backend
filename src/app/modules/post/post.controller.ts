import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { PostService } from './post.service';
import sendResponse from '../../../shared/sendResponse';
import { IPostResponse } from '../../../interface/common';

const createPost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await PostService.createPost(id, req.body, req.file);

  sendResponse<IPostResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'post created successfully',
    data: result,
  });
});

const getPostFeed = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };

  const cursor = req.query.cursor as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;

  const result = await PostService.getPostFeed(id, cursor, limit);

  sendResponse<{ posts: IPostResponse[]; nextCursor: string | null | undefined; hasMore: boolean }>(
    res,
    {
      statusCode: httpStatus.OK,
      success: true,
      message: 'post feed fetched successfully',
      data: result,
    }
  );
});

const getPostById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };

  const result = await PostService.getPostById(req.params.id as string, id);

  sendResponse<IPostResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'single post fetched successfully',
    data: result,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await PostService.updatePost(req.params.id as string, id, req.body);

  sendResponse<IPostResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'post update successfully',
    data: result,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await PostService.toggleLike(req.params.id as string, id);

  sendResponse<{ liked: boolean; message: string }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await PostService.deletePost(req.params.id as string, id);

  sendResponse<{ message: string }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: result,
  });
});

const getPostLikes = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.user as { id: string };
  const result = await PostService.getPostLikes(req.params.id as string, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'post likes fetched successfully',
    data: result,
  });
});

export const PostController = {
  createPost,
  getPostFeed,
  getPostById,
  updatePost,
  toggleLike,
  deletePost,
  getPostLikes,
};
