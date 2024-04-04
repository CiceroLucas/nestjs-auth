import { Injectable } from '@nestjs/common';
import { CurrentUser } from './auth/decorators/current-user.decorator';
import { User } from './users/user.entity';

@Injectable()
export class AppService {
  getMe(@CurrentUser() user: User) {
    return user;
  }
}
