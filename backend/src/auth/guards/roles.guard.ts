import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../../users/enums/role.enum';

/**
 * Guard RBAC : verifie que le role de l'utilisateur connecte
 * fait partie des roles autorises par @Roles(...) sur la route.
 * S'il n'y a pas de @Roles(...), la route est accessible a tout
 * utilisateur authentifie.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas les droits necessaires pour acceder a cette ressource",
      );
    }

    return true;
  }
}
