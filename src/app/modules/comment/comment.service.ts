import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { prisma } from '../../../shared/prisma';
import { ICreateComment, IUpdateComment } from './comment.interface';
import formatComment from '../../../helpers/formatComment';
import { ICommentResponse } from '../../../interface/common';

const createComment = async (userId: string, data: ICreateComment): Promise<ICommentResponse> => {
  const post = await prisma.post.findUnique({
    where: { id: data.postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.isPrivate && post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      postId: data.postId,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      likes: true,
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
  });

  return formatComment(comment);
};

const getCommentsByPostId = async (postId: string, userId: string): Promise<ICommentResponse[]> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.isPrivate && post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      likes: {
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return comments.map((comment) => formatComment(comment));
};

const updateComment = async (
  commentId: string,
  userId: string,
  data: IUpdateComment
): Promise<ICommentResponse> => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content: data.content },
    include: {
      author: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      likes: {
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: {
          likes: true,
          replies: true,
        },
      },
    },
  });

  return formatComment(updatedComment);
};

const deleteComment = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: {
        select: {
          authorId: true,
        },
      },
    },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.authorId !== userId && comment.post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  await prisma.comment.delete({
    where: { id: commentId },
  });

  return { message: 'Comment deleted successfully' };
};

const toggleLike = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: true,
    },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.authorId !== userId && comment.post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  const existingLike = await prisma.commentLike.findUnique({
    where: {
      commentId_userId: {
        commentId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.commentLike.delete({
      where: { id: existingLike.id },
    });
    return { liked: false, message: 'Comment unliked' };
  } else {
    await prisma.commentLike.create({
      data: {
        commentId,
        userId,
      },
    });
    return { liked: true, message: 'Comment liked' };
  }
};

const getCommentLikes = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: true,
    },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.authorId !== userId && comment.post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  const likes = await prisma.commentLike.findMany({
    where: { commentId },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return likes.map((like) => ({
    id: like.id,
    user: like.user,
    createdAt: like.createdAt,
  }));
};

export const CommentService = {
  createComment,
  getCommentsByPostId,
  updateComment,
  deleteComment,
  toggleLike,
  getCommentLikes,
};
