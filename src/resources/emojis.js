import api from '../api';

function emojis(config) {
  return {
    retrieve: (params) => {
      const url = `${config.apiURL}/realm/emoji`;
      return api(url, config, 'GET', params);
    },
  };
}

export default emojis;
