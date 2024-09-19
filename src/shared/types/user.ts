import { UserType } from './user-type.js';

export type User = {
  name: string;
  email: string;
  avatarPath: string;
  password: string;
  type: UserType
}
