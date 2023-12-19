import { inject } from 'inversify';
import { Request, Response } from 'express';
import { controller, httpPatch, httpPost } from 'inversify-express-utils';
import { UserService } from '../../service/user/user.service';
import { NewUserRequest } from '../../modals/user/new-user-request.model';

@controller('/user')
export class UserController {
  private userService: UserService;

  constructor(@inject(UserService) userService: UserService) {
    this.userService = userService;
  }

  @httpPost('/')
  public async createUser(req: Request, res: Response) {
    try {
      const newUserRequest: NewUserRequest = NewUserRequest.parseJson(req.body);

      // Check wheather user is already exists or not
      const existingUser = await this.userService.getUserByEmail(newUserRequest.email);
      if (existingUser) {
        throw new Error(
          `Error creating a new user. A user already exists with this ${newUserRequest.email} email address.`
        );
      }

      const user = await this.userService.createUser(newUserRequest);

      res.status(201).json({ status: 'success', message: 'User created successfully.', user });
    } catch (error: any) {
      console.log('-> error -----', error);
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  @httpPost('/login')
  public async loginUser(req: Request, res: Response) {
    try {
      // Check wheather user is already exists or not
      const existingUser = await this.userService.getUserByEmail(req.body.email);
      if (!existingUser) {
        throw new Error(`Can't find user with this email ${req.body.email} address. First register and try to login.`);
      }

      const token = await this.userService.loginUser(existingUser, req.body.password);

      return res.status(200).json({ status: 'success', token });
    } catch (error: any) {
      console.log('-> error -----', error);
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  @httpPost('/forgotpassword')
  public async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      // Check wheather user is already exists or not
      const existingUser = await this.userService.getUserByEmail(email);
      if (!existingUser) {
        throw new Error(`Can't find user with this email ${email} address. You can register with this email.`);
      }

      await this.userService.forgotPassword(existingUser);

      return res.status(200).json({
        status: 'success',
        message: 'Password reset email send successfully. Check your mail box and reset the password',
      });
    } catch (error: any) {
      console.log('-> error -----', error);
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }

  @httpPost('/resetpassword/:token')
  public async resetPassword(req: Request, res: Response) {
    try {
      await this.userService.resetPassword(req.body, req.params);

      return res.status(200).json({ status: 'success', message: 'Password Reset successfully' });
    } catch (error: any) {
      console.log('-> error -----', error);
      res.status(400).json({
        status: 'fail',
        message: error.message,
      });
    }
  }
}
