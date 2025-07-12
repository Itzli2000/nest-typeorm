import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: string[], ctx: ExecutionContext): Partial<User> => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req?.user as User;
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    return !data
      ? user
      : data.reduce((obj, item) => {
          obj[item] = user[item as keyof User];
          return obj;
        }, {} as Partial<User>);
  },
);
