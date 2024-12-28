import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { User } from '../schemas/user.schema';

export const Role = (...roles: string[]) => {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (!user || !user.roles) {
      throw new ForbiddenException('Access denied. No roles found.');
    }

    const hasRole = () => user.roles.some((role) => roles.includes(role));
    if (!hasRole()) {
      throw new ForbiddenException('Access denied. Insufficient role.');
    }

    return user;
  })();
};


