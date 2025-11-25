import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import formatPost from '../../../helpers/formatPost';
import { uploadToCloudinary, validateImage } from '../../../helpers/imageUpload.utils';
import { IPostResponse } from '../../../interface/common';
import { prisma } from '../../../shared/prisma';
import { IPost, IPostUpdate } from './post.interface';

const createPost = async (
  userId: string,
  data: IPost,
  postImageFile?: Express.Multer.File
): Promise<IPostResponse> => {
  let imageUrl: string | undefined;

  if (postImageFile) {
    validateImage(postImageFile);
    const uploadResult = await uploadToCloudinary(postImageFile.buffer, 'posts');
    imageUrl = uploadResult.url;
  }

  const post = await prisma.post.create({
    data: {
      content: data.content,
      imageUrl: imageUrl || data.imageUrl,
      isPrivate: Boolean(data.isPrivate),
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
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return formatPost(post, userId);
};

const getPostFeed = async (
  userId: string,
  cursor?: string,
  limit: number = 20
): Promise<{ posts: IPostResponse[]; nextCursor: string | null | undefined; hasMore: boolean }> => {
  const whereClause: any = {
    OR: [{ isPrivate: false }, { authorId: userId, isPrivate: true }],
  };

  if (cursor) {
    whereClause.AND = {
      createdAt: {
        lt: new Date(cursor),
      },
    };
  }

  const posts = await prisma.post.findMany({
    where: whereClause,
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
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit + 1,
  });

  const hasMore = posts.length > limit;

  const postsToReturn = hasMore ? posts.slice(0, limit) : posts;

  const nextCursor =
    hasMore && postsToReturn.length > 0
      ? postsToReturn[postsToReturn.length - 1]?.createdAt?.toISOString()
      : null;

  return {
    posts: postsToReturn.map((post) => formatPost(post, userId)),
    nextCursor,
    hasMore,
  };
};

const getPostById = async (postId: string, userId: string): Promise<IPostResponse> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
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
          comments: true,
        },
      },
    },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.isPrivate && post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  return formatPost(post, userId);
};

const updatePost = async (postId: string, userId: string, data: IPostUpdate) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      ...data,
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
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return formatPost(updatedPost, userId);
};

const toggleLike = async (
  postId: string,
  userId: string
): Promise<{ liked: boolean; message: string }> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.isPrivate && post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (existingLike) {
    await prisma.postLike.delete({
      where: { id: existingLike.id },
    });
    return { liked: false, message: 'Post unliked' };
  } else {
    await prisma.postLike.create({
      data: {
        postId,
        userId,
      },
    });
    return { liked: true, message: 'Post liked' };
  }
};

const deletePost = async (postId: string, userId: string): Promise<{ message: string }> => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return { message: 'Post deleted successfully' };
};

const getPostLikes = async (postId: string, userId: string) => {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (post.isPrivate && post.authorId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access denied');
  }

  const likes = await prisma.postLike.findMany({
    where: { postId },
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

export const PostService = {
  createPost,
  getPostFeed,
  getPostById,
  updatePost,
  toggleLike,
  deletePost,
  getPostLikes,
};
