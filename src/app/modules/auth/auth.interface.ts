export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IUserResponse {
  accessToken: string;
}

export interface ILogin {
  email: string;
  password: string;
}
