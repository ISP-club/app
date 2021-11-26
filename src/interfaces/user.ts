import {
  UserStatus,
  UserRole,
  UserType,
} from 'src/enum/user';

export interface UserProfileInterface {
  _id: string,
  status: UserStatus,
  roles: UserRole[],
  type: UserType,
  username: string,
  email: string,
  invite: string,
}

export interface UserSigninInterface {
  username: string,
  password: string,
  secret: string,
  remember: boolean
}

export interface UserSignupInterface {
  email: string,
  username: string,
  password: string,
  repeatPassword: string,
  accept: boolean,
  invite: string,
}
