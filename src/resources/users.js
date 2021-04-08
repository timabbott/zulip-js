import api from '../api';

function users(config) {
  return {
    retrieve: (params) => {
      const url = `${config.apiURL}/users`;
      return api(url, config, 'GET', params);
    },
    create: (params) => {
      const url = `${config.apiURL}/users`;
      return api(url, config, 'POST', params);
    },
    me: {
      pointer: {
        retrieve: (params) => {
          const url = `${config.apiURL}/users/me/pointer`;
          return api(url, config, 'GET', params);
        },
        update: (id) => {
          const url = `${config.apiURL}/users/me/pointer`;
          return api(url, config, 'POST', { pointer: id });
        },
      },
      getProfile: () => {
        const url = `${config.apiURL}/users/me`;
        return api(url, config, 'GET');
      },
      subscriptions: {
        add: (params) => {
          const url = `${config.apiURL}/users/me/subscriptions`;
          return api(url, config, 'POST', params);
        },
        remove: (params) => {
          const url = `${config.apiURL}/users/me/subscriptions`;
          return api(url, config, 'DELETE', params);
        },
      },
      alertWords: {
        retrieve: (params) => {
          const url = `${config.apiURL}/users/me/alert_words`;
          return api(url, config, 'GET', params);
        },
      },
    },
  };
}

export default users;
