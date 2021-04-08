import api from '../api';

function filters(config) {
  return {
    retrieve: (params) => {
      const url = `${config.apiURL}/realm/filters`;
      return api(url, config, 'GET', params);
    },
  };
}

export default filters;
