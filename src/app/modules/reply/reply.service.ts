import httpStatus from 'http-status';
import { prisma } from '../../../shared/prisma';
import { ICreateReply, IUpdateReply } from './reply.interface';
import ApiError from '../../../errors/ApiError';
import formatReply from '../../../helpers/formatReply';

const createReply = async (userId: string, data: ICreateReply) => {
  const comment = await prisma.comment.findUnique({
    where: { id: data.commentId },
    include: {
      post: true,
    },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.post.isPrivate && comment.post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const reply = await prisma.reply.create({
    data: {
      content: data.content,
      commentId: data.commentId,
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
      likes: {
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  return formatReply(reply);
};

const getRepliesByCommentId = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      post: true,
    },
  });

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Comment not found');
  }

  if (comment.post.isPrivate && comment.post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const replies = await prisma.reply.findMany({
    where: { commentId },
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
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return replies.map((reply) => formatReply(reply));
};

const updateReply = async (replyId: string, userId: string, data: IUpdateReply) => {
  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
  });

  if (!reply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }

  if (reply.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  const updatedReply = await prisma.reply.update({
    where: { id: replyId },
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
        },
      },
    },
  });

  return formatReply(updatedReply);
};

const deleteReply = async (replyId: string, userId: string) => {
  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
    include: {
      comment: {
        include: {
          post: {
            select: {
              authorId: true,
            },
          },
        },
      },
    },
  });

  if (!reply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }

  if (
    reply.authorId !== userId &&
    reply.comment.authorId !== userId &&
    reply.comment.post.authorId !== userId
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  await prisma.reply.delete({
    where: { id: replyId },
  });

  return { message: 'Reply deleted successfully' };
};

const toggleLike = async (replyId: string, userId: string) => {
  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
    include: {
      comment: {
        include: {
          post: true,
        },
      },
    },
  });

  if (!reply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }

  if (reply.comment.post.isPrivate && reply.comment.post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const existingLike = await prisma.replyLike.findUnique({
    where: {
      replyId_userId: {
        replyId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.replyLike.delete({
      where: { id: existingLike.id },
    });
    return { liked: false, message: 'Reply unliked' };
  } else {
    await prisma.replyLike.create({
      data: {
        replyId,
        userId,
      },
    });
    return { liked: true, message: 'Reply liked' };
  }
};

const getReplyLikes = async (replyId: string, userId: string) => {
  const reply = await prisma.reply.findUnique({
    where: { id: replyId },
    include: {
      comment: {
        include: {
          post: true,
        },
      },
    },
  });

  if (!reply) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Reply not found');
  }

  if (reply.comment.post.isPrivate && reply.comment.post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const likes = await prisma.replyLike.findMany({
    where: { replyId },
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

export const ReplyService = {
  createReply,
  updateReply,
  deleteReply,
  getRepliesByCommentId,
  toggleLike,
  getReplyLikes,
};
