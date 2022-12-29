import { Role } from './user.schema';

export interface UserPayload {
  email: string;
  _id: string;
  role: Role;
  iat: number;
  exp: number;
}
