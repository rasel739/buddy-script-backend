import { User } from '@prisma/client';
import { IGenericErrorMessage } from './error';

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export interface IImageUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface IPostResponse {
  id: string;
  content: string | null;
  imageUrl?: string | null;
  isPrivate: boolean;
  author: {
    id: string;
    fullName: string;
    email: string;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentResponse {
  id: string;
  content: string;
  postId: string;
  author: User;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
