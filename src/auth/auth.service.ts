import { Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoRefreshToken,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { ConfigService } from '@nestjs/config';
import { RegisterRequestDto } from './dto/register.request.dto';
import { AuthenticateRequestDto } from './dto/authenticate.request.dto';
import { ConfirmRequestDto } from './dto/confirm.request.dto';
import { RefreshTokenRequestDto } from './dto/refreshToken.request.dto';

@Injectable()
export class AuthService {
  private userPool: CognitoUserPool;

  constructor(private configService: ConfigService) {
    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
    });
  }

  async register(authRegisterRequest: RegisterRequestDto) {
    const { name, email, password } = authRegisterRequest;
    return new Promise((resolve, reject) => {
      return this.userPool.signUp(
        name,
        password,
        [new CognitoUserAttribute({ Name: 'email', Value: email })],
        null,
        (err, result) => {
          if (!result) {
            reject(err);
          } else {
            resolve(result.user);
          }
        },
      );
    });
  }

  async authenticate(user: AuthenticateRequestDto) {
    const { name, password } = user;
    const authenticationDetails = new AuthenticationDetails({
      Username: name,
      Password: password,
    });
    const userData = {
      Username: name,
      Pool: this.userPool,
    };
    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  async confirm(data: ConfirmRequestDto) {
    const { code, name } = data;

    const userData = {
      Username: name,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.confirmRegistration(code, false, (res) => {
        console.log(res);
        resolve(res);
      });
    });
  }

  async resendCode(name: string) {
    const userData = {
      Username: name,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.resendConfirmationCode((res) => {
        console.log(res);
        resolve(res);
      });
    });
  }

  async refreshToken(data: RefreshTokenRequestDto) {
    const userData = {
      Username: data.name,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      return newUser.refreshSession(
        new CognitoRefreshToken({ RefreshToken: data.refreshToken }),
        (err, session) => {
          //console.log(session);
          resolve(session);
        },
      );
    });
  }
}
