import { Container } from 'inversify';

import { UserService } from './service/user/user.service';

export const iocContainer = new Container();

// Services
iocContainer.bind<UserService>(UserService).to(UserService);
