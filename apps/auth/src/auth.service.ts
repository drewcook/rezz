import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from '@app/common';
import { Response } from 'express';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Creates a JWT with a payload of the current user's ID with the expiry set to the env var and set it as a cookie on the response.
   * The cookie is only available for HTTP requests itself, making it more secure. Clients cannot work with the cookie unless it sends a request.
   * @param user The current user in context after verifying email
   * @param response The JWT that is created
   */
  async login(user: UserDocument, response: Response) {
    // Pluck out the current user's ID
    const tokenPayload: TokenPayload = {
      userId: user._id.toHexString(),
    };
    // Set expiration based on env var
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );
    // Sign the JWT
    const token = this.jwtService.sign(tokenPayload);
    // Set the response Authentication cookie
    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
    // Return the JWT
    return token;
  }
}
