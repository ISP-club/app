import { UserProfileInterface } from 'src/interfaces/user';

export interface UserStateInterface {
  init: boolean | null;
  auth: boolean;
  profile: UserProfileInterface | null;
}

function state(): UserStateInterface {
  return {
    init: null,
    auth: false,
    profile: null
  }
}

export default state;
