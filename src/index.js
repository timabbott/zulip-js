import parseConfigFile from './zuliprc';

import api from './api';
import accounts from './resources/accounts';
import streams from './resources/streams';
import messages from './resources/messages';
import queues from './resources/queues';
import events from './resources/events';
import users from './resources/users';
import emojis from './resources/emojis';
import typing from './resources/typing';
import reactions from './resources/reactions';
import server from './resources/server';
import filters from './resources/filters';
import eventsWapper from './events_wrapper';

function getCallEndpoint(config) {
  return function callEndpoint(endpoint, method = 'GET', params) {
    const myConfig = { ...config };
    let finalendpoint = endpoint;
    if (!endpoint.startsWith('/')) {
      finalendpoint = `/${endpoint}`;
    }
    const url = myConfig.apiURL + finalendpoint;
    return api(url, myConfig, method, params);
  };
}

function resources(config) {
  return {
    config,
    callEndpoint: getCallEndpoint(config),
    accounts: accounts(config),
    streams: streams(config),
    messages: messages(config),
    queues: queues(config),
    events: events(config),
    users: users(config),
    emojis: emojis(config),
    typing: typing(config),
    reactions: reactions(config),
    server: server(config),
    filters: filters(config),
    callOnEachEvent: eventsWapper(config),
  };
}

async function zulip(initialConfig) {
  if (initialConfig.zuliprc) {
    return resources(await parseConfigFile(initialConfig.zuliprc));
  }
  const config = initialConfig;
  if (config.realm.endsWith('/api')) {
    config.apiURL = `${config.realm}/v1`;
  } else {
    config.apiURL = `${config.realm}/api/v1`;
  }

  if (!config.apiKey) {
    const res = await accounts(config).retrieve();
    config.apiKey = res.api_key;
  }
  return resources(config);
}

export default zulip;
