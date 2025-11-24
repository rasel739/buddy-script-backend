export interface IPost {
  content: string;
  isPrivate: boolean;
  imageUrl: string;
}

export interface IPostUpdate {
  content?: string;
  isPrivate?: boolean;
}
