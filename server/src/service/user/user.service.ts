import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { User, UserDocument, UserModel } from '../../modals/user/user.model';
import { forgotPasswordEmail } from '../../utils/email/emailContant';
import { ValidationUtil } from '../../utils/validation/validation.util';
import { NewUserRequest } from '../../modals/user/new-user-request.model';

@injectable()
export class UserService {
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
   * Get user by email
   * @param email
   * @returns user
   */
  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    const user = await UserModel.findOne({ email });

    return user;
  }

  /**
   * Create user
   * @param newUserRequest
   * @returns user
   */
  public async createUser(newUserRequest: NewUserRequest): Promise<UserDocument> {
    // Check any value is invalid or not
    const invalidPayloadMessage = ValidationUtil.validateUserCreateRequest(newUserRequest);
    if (invalidPayloadMessage) {
      throw new Error(invalidPayloadMessage);
    }

    // Create payload for insert new record
    const payload = await User.getCreateUserPayload(newUserRequest);

    return await UserModel.create(payload);
  }

  public async loginUser(user: UserDocument, password: string) {
    if (!(await this.comparePassword(password, user.password as string))) {
      throw new Error('Email or Password incorrect. Check your Login credentials.');
    }

    return this.tokenGenerate(user._id);
  }

  public async forgotPassword(user: UserDocument) {
    try {
      const resetToken = crypto.randomBytes(32).toString('hex');

      user.passwordResetToken = crypto.createHash(this.createhash_key).update(resetToken).digest('hex');
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
      await user.save({ validateBeforeSave: false });

      await forgotPasswordEmail(resetToken, user.email);

      return true;
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw error;
    }
  }

  /**
   * Reset password
   * @param body
   * @param params
   * @returns
   */
  public async resetPassword(body: any, params: any) {
    const hashedToken = crypto.createHash(this.createhash_key).update(params.token).digest('hex');

    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    user.password = await bcryptjs.hash(body.password as string, this.password_encrypt_level);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return true;
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

  /**
   * Compares password
   * @param candidatePassword
   * @param userPassword
   * @returns
   */
  public async comparePassword(candidatePassword: string, userPassword: string): Promise<Boolean> {
    return await bcryptjs.compare(candidatePassword, userPassword);
  }
}
