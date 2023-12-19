import mongoose, { Schema, Document, Model } from 'mongoose';
import bcryptjs from 'bcryptjs';

export interface TokenDocument extends Document {
  userId: string;
  token: string;
  otp: number;
  exprire: number;
  createdAt: Date;
  updatedAt: Date;
}

export const TokenSchema: Schema<TokenDocument> = new Schema<TokenDocument>({
  userId: { type: String, required: true },
  token: { type: String, required: true },
  otp: { type: Number, required: true, min: 6, max: 6 },
  exprire: { type: Number, required: true },
  createdAt: Date,
  updatedAt: Date,
});

export const TokenModel: Model<TokenDocument> = mongoose.model<TokenDocument>('user', TokenSchema);

export class Token {
  public userId: string | undefined;
  public otp: number | undefined;
  public exprire: number | undefined;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;
  // public lastLoginDate: Date | undefined;
  public static PASSWORD_ENCRYPT_LEVEL: number;

  public static getCreateUserPayload(userId: string) {
    const token = new Token();

    token.userId = userId;
    token.otp = this.otpGenerate();
    token.exprire = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
    token.createdAt = new Date();
    token.updatedAt = new Date();

    return token;
  }

  public static otpGenerate(): number {
    const numbers = '1234567890';
    let randomString = '';

    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      randomString += numbers.charAt(randomIndex);
    }

    return Number(randomString);
  }

  // public static getUpdateModel(input: any): any {
  //   const properties = ['password'];
  //   const updateModel: any = {};
  //   for (const property of properties) {
  //     if (input[property] !== undefined) {
  //       updateModel[property] = input[property];
  //     }
  //   }
  //   updateModel['updatedAt'] = new Date();
  //   const setModel = { $set: updateModel };
  //   return setModel;
  // }
}
