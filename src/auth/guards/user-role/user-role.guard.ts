import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from '../../decorators/role-protected.decorator';
import { ValidRoles } from '../../types';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: ValidRoles[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as User;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (validRoles.length === 0) return true;

    for (const role of user.roles) {
      if (validRoles.includes(role as ValidRoles)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} needs a valid role: [${validRoles.join(', ')}]`,
    );
  }
}
