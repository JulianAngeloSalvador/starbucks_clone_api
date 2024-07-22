import { Request } from 'express';
import { User } from 'src/users/schema/User.schema';

export type Payload = Omit<User, 'password'>;

declare global {
  namespace Express {
    interface Request {
      user: User & {
        sub?: Payload;
      };
    }
  }
}
