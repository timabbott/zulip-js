const api = require('../api');

function typing(config) {
  return {
    send: (initialParams) => {
      const url = `${config.apiURL}/typing`;
      const params = Object.assign({}, initialParams);
      if (params.to.length > 1) {
        params.to = JSON.stringify(params.to);
      }
      return api(url, config, 'POST', params);
    },
  };
}

module.exports = typing;
