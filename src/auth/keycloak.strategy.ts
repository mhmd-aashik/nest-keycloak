import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import JwksRsa from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/types';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['ES256'],
      secretOrKeyProvider: JwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: process.env.KEYCLOAK_JWKS_URI as string,
      }),
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      username: payload.preferred_username,
      email: payload.email,
      roles: payload.realm_access?.roles ?? [],
    };
  }
}
