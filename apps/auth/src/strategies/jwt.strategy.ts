import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
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
      // The JWT is stored as a cookie from the `auth/login` route
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication,
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
