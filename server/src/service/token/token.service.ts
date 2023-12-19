import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { User, UserDocument, UserModel } from '../../modals/user/user.model';
import { forgotPasswordEmail } from '../../utils/email/emailContant';
import { ValidationUtil } from '../../utils/validation/validation.util';
import { NewUserRequest } from '../../modals/user/new-user-request.model';

@injectable()
export class TokenService {
  public jwt_secret: string;
  public jwt_expire: string;
  public createhash_key: string;
  public password_encrypt_level: number;

  constructor() {
    this.jwt_secret = process.env.JWT_SECRET || '';
    this.jwt_expire = process.env.JWT_EXPIRES_IN || '';
    this.createhash_key = process.env.CREATEHASH_KEY || '';
    this.password_encrypt_level = Number(process.env.PASSWORD_ENCRYPT_LEVEL);
  }

  /**
   * Token generate
   * @param id
   * @returns token
   */
  public tokenGenerate(id: string): string {
    return jwt.sign({ id }, this.jwt_secret, {
      expiresIn: this.jwt_expire,
    });
  }
}
