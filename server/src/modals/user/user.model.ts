import mongoose, { Schema, Document, Model } from 'mongoose';
import bcryptjs from 'bcryptjs';
import { NewUserRequest } from './new-user-request.model';

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  userName: string;
  gender: string;
  dob: Date;
  age: Number;
  mobileNumber: Number;
  email: string;
  password: string;
  isActive: Boolean;
  deleted: Boolean;
  passwordChangedAt: Date;
  passwordResetToken: string | undefined;
  passwordResetExpires: Number | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema: Schema<UserDocument> = new Schema<UserDocument>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  userName: { type: String, required: true, trim: true, unique: true },
  gender: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  age: { type: Number, required: true },
  mobileNumber: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: {
    type: String,
    required: true,
    trim: true,
    min: 8,
    max: 20,
  },
  isActive: Boolean,
  deleted: Boolean,
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Number,
  createdAt: Date,
  updatedAt: Date,
});

export const UserModel: Model<UserDocument> = mongoose.model<UserDocument>('user', UserSchema);

export class User {
  public firstName: String | undefined;
  public lastName: String | undefined;
  public userName: string | undefined;
  public gender: String | undefined;
  public dob: Date | undefined;
  public age: Number | undefined;
  public mobileNumber: Number | undefined;
  public email: String | undefined;
  public password: String | undefined;
  public isActive: Boolean | undefined;
  public deleted: Boolean | undefined;
  public passwordChangedAt: Date | undefined;
  public passwordResetToken: String | undefined;
  public passwordResetExpires: Date | undefined;
  public createdAt: Date | undefined;
  public updatedAt: Date | undefined;
  // public lastLoginDate: Date | undefined;
  public static PASSWORD_ENCRYPT_LEVEL: number;

  constructor() {
    User.PASSWORD_ENCRYPT_LEVEL = Number(process.env.PASSWORD_ENCRYPT_LEVEL);
  }

  public static getCreateUserPayload = async (body: NewUserRequest) => {
    const user = new User();

    user.firstName = body.firstName;
    user.lastName = body.lastName;
    user.userName = body.userName;
    user.gender = body.gender;
    user.dob = body.dob;
    user.age = body.age;
    user.mobileNumber = body.mobileNumber;
    user.email = body.email;
    user.password = await bcryptjs.hash(body.password as string, this.PASSWORD_ENCRYPT_LEVEL);
    user.createdAt = new Date();
    user.updatedAt = new Date();
    user.isActive = true;
    user.deleted = false;

    return user;
  };

  public static getUpdateModel(input: any): any {
    const properties = ['password'];
    const updateModel: any = {};
    for (const property of properties) {
      if (input[property] !== undefined) {
        updateModel[property] = input[property];
      }
    }
    updateModel['updatedAt'] = new Date();
    const setModel = { $set: updateModel };
    return setModel;
  }
}
