import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

/**
 * A Passport strategy that extracts the JWT from the cookie and verifies it against the current user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // This could be a request passed from Express or from an RPC call.
      // The JWT will be on the cookies object if via HTTP or directly on the request object if via RPC.
      // The JWT is written as an Authentication cookie from the `auth/login` route (for HTTP).
      // The JWT is returned from the auth service 'login' method directly as a header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication ||
          request?.Authentication ||
          request?.headers.authentication,
      ]),
      // Same key used to sign the token is used to verify it
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Checks to see if the userId on the JWT actually exists
   * @param token payload
   * @returns the User document that matches with the JWT's userId
   */
  async validate({ userId }: TokenPayload) {
    return this.usersService.getUser({ _id: userId });
  }
}
