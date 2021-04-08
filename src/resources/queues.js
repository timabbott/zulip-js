import api from '../api';

function queues(config) {
  return {
    register: (initialParams) => {
      const url = `${config.apiURL}/register`;
      const params = { ...initialParams };
      if (params.event_types) {
        params.event_types = JSON.stringify(params.event_types);
      }
      return api(url, config, 'POST', params);
    },
    deregister: (params) => {
      const url = `${config.apiURL}/events`;
      return api(url, config, 'DELETE', params);
    },
  };
}

export default queues;
