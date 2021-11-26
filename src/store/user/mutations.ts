import { MutationTree } from 'vuex';
import { UserStateInterface } from './state';

import { UserProfileInterface } from 'src/interfaces/user';

const mutation: MutationTree<UserStateInterface> = {
  init (state: UserStateInterface, payload: boolean | null) {
    state.init = payload;
  },
  auth (state: UserStateInterface, payload: boolean) {
    state.auth = payload;
  },
  profile (state: UserStateInterface, payload: UserProfileInterface | null) {
    state.profile = payload;
  },
};

export default mutation;
