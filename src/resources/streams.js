import api from '../api';

function streams(config) {
  return {
    retrieve: (params) => {
      const url = `${config.apiURL}/streams`;
      return api(url, config, 'GET', params);
    },
    getStreamId: (initialParams) => {
      const url = `${config.apiURL}/get_stream_id`;
      let params = { ...initialParams };
      if (typeof initialParams === 'string') {
        params = {
          stream: initialParams,
        };
      }
      return api(url, config, 'GET', params);
    },
    subscriptions: {
      retrieve: (params) => {
        const url = `${config.apiURL}/users/me/subscriptions`;
        return api(url, config, 'GET', params);
      },
    },
    topics: {
      retrieve: (params) => {
        const url = `${config.apiURL}/users/me/${params.stream_id}/topics`;
        return api(url, config, 'GET');
      },
    },
    deleteById: (params) => {
      const url = `${config.apiURL}/streams/${params.stream_id}`;
      return api(url, config, 'DELETE', params);
    },
  };
}

export default streams;
