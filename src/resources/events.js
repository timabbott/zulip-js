import api from '../api';

function events(config) {
  return {
    retrieve: (params) => {
      const url = `${config.apiURL}/events`;
      return api(url, config, 'GET', params);
    },
  };
}

export default events;
