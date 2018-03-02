import parseConfigFile from './zuliprc';

const api = require('./api');

let globalconfig = {};

const accounts = require('./resources/accounts');
const streams = require('./resources/streams');
const messages = require('./resources/messages');
const queues = require('./resources/queues');
const events = require('./resources/events');
const users = require('./resources/users');
const emojis = require('./resources/emojis');
const typing = require('./resources/typing');
const reactions = require('./resources/reactions');

function callEndpoint(endpoint, method = 'GET', params) {
  let finalendpoint = endpoint;
  if (!endpoint.startsWith('/')) {
    finalendpoint = `/${endpoint}`; // eslint-disable-line
  }
  const url = globalconfig.apiURL + finalendpoint;
  return api(url, globalconfig, method, params);
}

function resources(config) {
  return {
    config,
    callEndpoint,
    accounts: accounts(config),
    streams: streams(config),
    messages: messages(config),
    queues: queues(config),
    events: events(config),
    users: users(config),
    emojis: emojis(config),
    typing: typing(config),
    reactions: reactions(config),
  };
}

function zulip(initialConfig) {
  if (initialConfig.zuliprc) {
    return parseConfigFile(initialConfig.zuliprc).then(config => resources(config));
  }
  const config = initialConfig;
  globalconfig = config;
  if (config.realm.endsWith('/api')) {
    config.apiURL = `${config.realm}/v1`;
  } else {
    config.apiURL = `${config.realm}/api/v1`;
  }

  if (!config.apiKey) {
    return accounts(config).retrieve().then((res) => {
      config.apiKey = res.api_key;
      return resources(config);
    });
  }
  return Promise.resolve(resources(config));
}

module.exports = zulip;
