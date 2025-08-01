import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
            'roles', [
            context.getHandler(),
            context.getClass()
        ]
        )

        if (!requiredRoles) return true

        const request = context.switchToHttp().getRequest()
        const user = request.user

        const hasRequiredRole = requiredRoles.some(role => user.role.includes(role))

        if (!hasRequiredRole) throw new ForbiddenException('Insufficient permissions')
        return true
    }

}