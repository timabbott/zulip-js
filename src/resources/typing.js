import api from '../api';

function typing(config) {
  return {
    send: (initialParams) => {
      const url = `${config.apiURL}/typing`;
      const params = { ...initialParams };
      if (params.to.length > 1) {
        params.to = JSON.stringify(params.to);
      }
      return api(url, config, 'POST', params);
    },
  };
}

export default typing;
