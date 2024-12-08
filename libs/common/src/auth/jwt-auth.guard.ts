import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services.constants';
import { ClientProxy } from '@nestjs/microservices';
import { UserDto } from '../dto';
import { Reflector } from '@nestjs/core';

/**
 * A common auth guard that can be used across any other microservice. It will be used to authenticate for all HTTP requests the need it outside of the Auth microservice.
 * We assume that any service using this JWT auth guard is going to have an injectable client proxy that is used to make TCP requests to other microservices.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  /**
   * Check first if there's a JWT attached to the HTTP request (should have been from 'auth/login'). If so, send a message to the auth service that matches the authentication pattern and data shape.
   * Check for roles from the custom @Roles decorator and validate.
   * @returns An observable. The authenticate method will return the authenticated user as a response; attach the response as the 'user' field on the request object, return true for activation status.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check for the JWT
    const jwt =
      context.switchToHttp().getRequest().cookies?.Authentication ||
      context.switchToHttp().getRequest().headers?.authentication;
    if (!jwt) return false;

    // Check for roles - handler is the controller route being called
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<UserDto>('authenticate', {
        Authentication: jwt,
      })
      .pipe(
        tap((res) => {
          // Validate roles
          if (roles) {
            for (const role of roles) {
              if (!res.roles?.includes(role)) {
                this.logger.error('The user does not have valid roles.');
                throw new UnauthorizedException();
              }
            }
          }

          // Set user field on the request object
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
