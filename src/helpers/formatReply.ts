interface IReplyService {
  id: string;
  content: string;
  commentId: string;
  author: any;
  _count: {
    likes: number;
  };
  likes: Array<any>;
  createdAt: Date;
  updatedAt: Date;
}

const formatReply = (reply: IReplyService) => {
  return {
    id: reply.id,
    content: reply.content,
    commentId: reply.commentId,
    author: reply.author,
    likesCount: reply._count.likes,
    isLiked: reply.likes && reply.likes.length > 0,
    createdAt: reply.createdAt,
    updatedAt: reply.updatedAt,
  };
};

export default formatReply;
