import helper from '../helper';

function accounts(config) {
  return {
    retrieve: async () => {
      const url = `${config.apiURL}/fetch_api_key`;
      const form = new helper.FormData();
      form.append('username', config.username);
      form.append('password', config.password);
      const res = await helper.fetch(url, {
        method: 'POST',
        body: form,
      });
      return res.json();
    },
  };
}

export default accounts;
