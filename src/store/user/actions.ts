import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';

import { Loading } from 'quasar'
import { api } from 'src/boot/axios'

import { UserSigninInterface } from 'src/interfaces/user';

const actions: ActionTree<UserStateInterface, StateInterface> = {
  init({ dispatch, commit, state }, force = false) {
    return new Promise((resolve, reject) => {
      if (((localStorage.getItem('token')) && (!state.auth)) || force) {
        api.defaults.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token');
        Loading.show();
        api({
          url: 'user/profile',
          method: 'get'
        })
          .then(response => {
            Loading.hide();
            switch (response.status) {
              case 200:
                commit('init', true);
                commit('auth', true);
                commit('profile', response.data);
                resolve(<string>localStorage.getItem('token'));
                break;
              default:
                dispatch('logout').then(() => reject);
            }
          })
          .catch(() => {
            Loading.hide();
            dispatch('logout').then(() => reject);
          })
      } else {
        commit('init', true);
        state.auth ? resolve(<string>localStorage.getItem('token')) : reject(false);
      }
    })
  },
  login({ dispatch, commit }, auth: UserSigninInterface) {
    return new Promise((resolve, reject) => {
      Loading.show();
      api({
        url: 'user/signin',
        data: auth,
        method: 'post'
      })
        .then(response => {
          Loading.hide();
          switch (response.status) {
            case 201:
              localStorage.setItem('token', response.data.accessToken);
              dispatch('init', true)
                .then(token => resolve(token))
                .catch(() => reject(false));
              break;
            default:
              dispatch('logout').then(() => reject);
          }
        })
        .catch((error) => {
          dispatch('logout').then(() => reject(error.response.data));
          Loading.hide();
        })
    })
  },
  logout({ commit }) {
    return new Promise<void>((resolve) => {
      localStorage.removeItem('token');
      commit('init', true);
      commit('auth', false);
      commit('profile', null);
      delete api.defaults.headers.common.Authorization;
      resolve()
    })
  }
};

export default actions;
