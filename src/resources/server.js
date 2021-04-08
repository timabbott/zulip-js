import api from '../api';

function server(config) {
  return {
    settings: (params) => {
      const url = `${config.apiURL}/server_settings`;
      return api(url, config, 'GET', params);
    },
  };
}

export default server;
