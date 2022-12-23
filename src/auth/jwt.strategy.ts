import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 3,
        jwksUri: `https://cognito-idp.${configService.get(
          'AWS_REGION',
        )}.amazonaws.com/${configService.get(
          'AWS_COGNITO_USER_POOL_ID',
        )}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.get('AWS_COGNITO_CLIENT_ID'),
      issuer: `https://cognito-idp.${configService.get(
        'AWS_REGION',
      )}.amazonaws.com/${configService.get('AWS_COGNITO_USER_POOL_ID')}`,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    return payload.email;
  }
}
