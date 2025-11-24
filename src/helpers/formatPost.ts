import { IPostResponse } from '../interface/common';

const formatPost = (post: any, currentUserId: string) => {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    isPrivate: post.isPrivate,
    author: post.author,
    likesCount: post._count.likes,
    commentsCount: post._count.comments,
    isLiked: post.likes && post.likes.length > 0,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
};

export default formatPost;
