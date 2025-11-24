import { ICommentResponse } from '../interface/common';

interface IComment {
  id: string;
  content: string;
  postId: string;
  author: any;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    likes: number;
    replies: number;
  };
  likes: Array<any>;
}

const formatComment = (comment: IComment) => {
  return {
    id: comment.id,
    content: comment.content,
    postId: comment.postId,
    author: comment.author,
    likesCount: comment._count.likes,
    repliesCount: comment._count.replies,
    isLiked: comment.likes && comment.likes.length > 0,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
};

export default formatComment;
