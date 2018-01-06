# zulip-js [![Build Status](https://travis-ci.org/zulip/zulip-js.svg?branch=master)](https://travis-ci.org/zulip/zulip-js)
Javascript library to access the Zulip API

# Usage
## Initialization
### With API Key
```js
const config = {
  username: process.env.ZULIP_USERNAME,
  apiKey: process.env.ZULIP_API_KEY,
  realm: process.env.ZULIP_REALM
};

const zulip = require('zulip-js')(config);

zulip.streams.subscriptions().then(res => {
  console.log(res);
});
```

### With Username & Password
You will need to first retrieve the API key by calling `zulip(config)` and then use the zulip object that it passes to `.then()`

```js
const zulip = require('zulip-js');
const config = {
  username: process.env.ZULIP_USERNAME,
  password: process.env.ZULIP_PASSWORD,
  realm: process.env.ZULIP_REALM
};

//Fetch API Key
zulip(config).then(zulip => {
  // The zulip object now contains the API Key
  zulip.streams.subscriptions().then(res => {
    console.log(res);
  });
});
```

### With zuliprc
Create a file called `zuliprc` (in the same directory as your code) which looks like:
```
[api]
email=cordelia@zulip.com
key=wlueAg7cQXqKpUgIaPP3dmF4vibZXal7
site=http://localhost:9991
```

Please remember to add this file to your `.gitignore`!
Calling `zulip({ zuliprc: 'zuliprc' } )` will read this file and then pass a configured zulip object to `.then()`.

```js
const zulip = require('zulip-js');
const path = require('path');
const zuliprc = path.resolve(__dirname, 'zuliprc');
zulip({ zuliprc }).then(zulip => 
  // The zulip object now contains the config from the zuliprc file
  zulip.streams.subscriptions().then(res => {
    console.log(res);
  });
});
```

## Accounts
### Fetch API Key
`zulip.accounts.retrieve()` returns a promise that you can use to retrieve your `API key`.

```js
// After initializing the zulip object
zulip.accounts.retrieve().then(res => {
 console.log(res);
});
/* Prints
{ msg: '',
  api_key: 'your api key',
  result: 'success',
  email: 'your email address'
}
*/
```

## Streams
### Get All Streams
`zulip.streams.retrieve()` returns a promise that can be used to retrieve all streams.

```js
// After initializing the zulip object
zulip.streams.retrieve().then(res => {
  console.log(res);
});
/* Prints
{
  msg: '',
  result: 'success',
  streams: [
    ...
  ]
}
*/
```

### Get User's Subscribed Streams
`zulip.streams.subscriptions.retrieve()` returns a promise that can be used to retrieve the user's subscriptions.

```js
// After initializing the zulip object
zulip.streams.subscriptions.retrieve().then(res => {
  console.log(res);
});
/* Prints
{ msg: '',
  result: 'success',
  subscriptions: [
   ...
  ]
}
*/
```

## Messages
### Send a Messge
`zulip.messages.send()` returns a promise that can be used to send a message.

```js
// After initializing the zulip object
const params = {
  to: 'test-bot',
  type: 'stream',
  subject: 'Testing zulip-js',
  content: 'Something is wrong....'
};

// Send a message
zulip.messages.send(params).then(res => {
  // Response includes Message ID
  console.log(res);
});
```

### Read Messages from a Stream
`zulip.messages.retrieve()` returns a promise that can be used to retrieve messages from a stream. You need to specify the id of the message to be used as an anchor. Use `1000000000` to retrieve the most recent message, or [`zulip.users.me.pointer.retrieve()`](#fetching-a-pointer-for-a-user) to get the id of the last message the user read.

```js
const params = {
  stream: 'test-bot',
  type: 'stream',
  anchor: res.id,
  num_before: 1,
  num_after: 1,
};

// Fetch messages anchored around id (1 before, 1 after)
zulip.messages.retrieve(params).then(console.log);

// Fetch the most recent message
params.anchor = 1000000000;
zulip.messages.retrieve(params).then(console.log);

// Fetch the pointer for the user
zulip.users.me.pointer.retrieve().then((res) => {
  // Fetch messages anchored around the last message the user read (1 before, 1 after)
  params.anchor = res.pointer;
  zulip.messages.retrieve(params).then(console.log);
});
```

### Message Flags
Message flags are used to mark message as read or unread, to star a message, and much more!

#### Valid Message Flags
The list of possible flags is:
['read', 'starred', 'mentioned', 'wildcard_mentioned', 'has_alert_word', 'historical']

#### Adding a Flag
`zulip.messages.flags.add({flag, messages})` can be used to add a flag to a list of messages.
Its params are `flag`, which is a string from the [list of possible flags](#valid-message-flags),
and `messages` which is an array of message ids (integers).

```js
// Mark the first message as read
const params = {
  messages: [0],
  flag: 'read',
};
zulip.messages.flags.add(params).then(console.log);
```

#### Removing a Flag
`zulip.messages.flags.remove({flag, messages})` can be used to remove a flag from a list of messages.
Its params are `flag`, which is a string from the [list of possible flags](#valid-message-flags),
and `messages` which is an array of message ids (integers).

```js
// Mark the first message as unread
const params = {
  messages: [0],
  flag: 'read',
};
zulip.messages.flags.remove(params).then(console.log);
```

### Private Messages
#### Send a Private Message
Specify `type` to be `private` in the params object passed to `zulip.messages.send()`

```js
const params = {
  to: process.env.ZULIP_TEST_USERNAME,
  type: 'private',
  subject: 'Testing zulip-js',
  content: 'Something is wrong....'
};

zulip.messages.send(params).then(res => {
  console.log(res);
});
``` 

#### Checking Private Messages
Using a message's id as the `anchor`, add a `narrow` to the params passed to `zulip.messages.retrieve()`. The `narrow` is an array of objects, in this case just `{operator: 'is', operand: 'private'}`. Note that the anchor can be set to `1000000000` to get the most recent message, or to the user's pointer using [`zulip.users.me.pointer.retrieve()`](#fetching-a-pointer-for-a-user).

```js
const id = 'some message id';
const params = {
  anchor: id,
  narrow: [{
    operator: 'is',
    operand: 'private'
  }],
  num_before: 1,
  num_after: 1,
};
// Fetch messages anchored around id (1 before, 1 after)
zulip.messages.retrieve(params).then(console.log);
// Fetch most recent message
const mostRecentParams = {
  anchor: 1000000000,
  narrow: [{
    operator: 'is',
    operand: 'private'
  }],
  num_before: 1,
  num_after: 1,
};
zulip.messages.retrieve(mostRecentParams).then(console.log);
// Fetch pointer for the user
zulip.users.me.pointer.retrieve().then((res) => {
  // Fetch messages anchored around last read message (1 before, 1 after)
  mostRecentParams.anchor = res.pointer;
  zulip.messages.retrieve(mostRecentParams).then(console.log);
});
```

## Queues
### Register a Queue
`zulip.queues.register()` registers a new queue. You can pass it a params object with the types of events you are interested in and whether you want to receive raw text or html (using markdown):

```js
{
  event_types: ['message', 'subscriptions', 'realm_user', 'pointer']
  apply_markdown: True
}
```

For example:

```js
// After initializing the zulip object
// Register queue to receive messages for user
const params = {
    event_types: ['message']
};

zulip.queues.register(params).then(res => {
  console.log(res);
  // Prints
  // { msg: '',
  //   max_message_id: 100375522,
  //   last_event_id: -1,
  //   result: 'success',
  //   queue_id: 'some queue id' }
});
```

## Events
### Retrieve Events from a Queue
`zulip.events.retrieve()` retrieves events from a queue. You can pass it a params object with the id of the queue you are interested in, the last event id that you have received and wish to acknowlege. You can also specify whether the server should not block on this request until there is a new event (the default is to block).

```js
{
  queue_id: 'the queue id',
  last_event_id: -1,
  dont_block: false
};


```

For example:

```js
// After initializing the zulip object
// Retrieve events from a queue
// Blocking until there is an event (or the request times out)
const params = {
  queue_id: 'your queue id',
  last_event_id: -1,
  dont_block: false
};

zulip.events.retrieve(params).then(res => {
  console.log(res);
  // Prints
  // { msg: '',
  //   result: 'success',
  //   handler_id: 2005928,
  //   events:
  //     [ { flags: [Object], message: [Object], type: 'message', id: 0 },
  //       { type: 'heartbeat', id: 1 },
  //       { flags: [], message: [Object], type: 'message', id: 2 },
  //       { flags: [], message: [Object], type: 'message', id: 3 },
  //       { flags: [], message: [Object], type: 'message', id: 4 } ] }
});
```

## Users
### Fetching all users (bots included)
`zulip.users.retrieve()` retrieves all users for this realm.

```js
zulip.users.retrieve({}).then(res => {
  console.log(res);
  //  Prints
  //  { msg: '',
  //    result: 'success',
  //    members:
  //    [ { is_bot: false,
  //        is_active: true,
  //        avatar_url: 'https://secure.gravatar.com/avatar/sfgsgsfsfh84785346gsfgsgf?d=identicon',
  //        is_admin: false,
  //        full_name: 'John Doe',
  //        email: 'john.doe@exmaple.com' },
  //   ...
});
```

### Fetching a pointer for a user
`zulip.users.me.pointer.retrieve()` retrieves a pointer for a user. The pointer is the id of the last message the user read. This can then be used as an anchor message id for subsequent API calls.

```js
// Prints
// { msg: '', pointer: 3432741029383298, result: 'success' }
zulip.users.me.pointer.retrieve().then(console.log);
``` 

## Realm Emojis
### Fetching Realm Emojis
`zulip.emojis.retrieve()` retrieves the list of realm specific emojis.

```js
zulip.emojis.retrieve().then(res => {
  console.log(res);
  //  Prints
  // { msg: '',
  //   result: 'success',
  //     emoji: {
  //       doge: {
  //         source_url: 'http://web.mit.edu/jesstess/www/doge.png',
  //         display_url: 'https://uploads.zulipusercontent.net/edc1569f7cb021b4877bc800019bef0960ed5b03/687474703a2f2f7765622e6d69742e6564752f6a657373746573732f7777772f646f67652e706e67'
  //       },
  //   ...
});
``` 

## Typing Notifications
### Sending Typing Notifications
`zulip.typing.send()` can be used to send a typing notification. The parameters required are `to` (either a username or a list of usernames) and `op` (either `start` or `stop`).

```js
{
  to: 'hamlet@zulip.com',
  op: 'start',
};
```

For example:

```js
// After initializing the zulip object
// Send a typing started notification to hamlet@zulip.com
const params = {
  to: 'hamlet@zulip.com'
  op: 'start'
};

zulip.typing.send(params).then(res => {
  console.log(res);
  // Prints
  // { msg: '',
  //   result: 'success',
  //   handler_id: 2005928,
  //   events:
  //     [ { flags: [Object], message: [Object], type: 'message', id: 0 },
  //       { type: 'heartbeat', id: 1 },
  //       { flags: [], message: [Object], type: 'message', id: 2 },
  //       { flags: [], message: [Object], type: 'message', id: 3 },
  //       { flags: [], message: [Object], type: 'message', id: 4 } ] }
});
```

### Retrieving Typing Notification Events
Use [`zulip.queues.register()`]('#register-a-queue') to register a queue to listen to typing notification events. This can be done by including `typing` in the list of `event_types` in the parameters passed.

```js
const queueParams = {
  event_types: ['typing']
}
```

Now [`zulip.events.retrieve()`]('#retrieve-events-from-a-queue') can be used to retrieve typing notification events using the `queue_id` recieved when registering the queue.

```js
const eventParams = {
  queue_id: 'the queue id',
  last_event_id: -1,
  dont_block: false
};
```

A typing notification event looks like:

```js
{
  type: 'typing',
  op: 'start',
  sender: 'email address',
  recipient: [{id: 1, email: 'email address for user id 1'}]
}
```

For example,

```js
// After initializing the zulip object
// Register a queue to listen to typing notification events
zulip.queues.register({event_types: ['typing']}).then((res) => {
  // Retrieve events from a queue
  // Blocking until there is an event (or the request times out)
  const params = {
    queue_id: res.queue_id,
    last_event_id: -1,
    dont_block: false
  };

  zulip.events.retrieve(params).then(res => {
    console.log(res);
    // Prints
    // { msg: '',
    //   result: 'success',
    //   handler_id: 2005928,
    //   events: [{
    //     type: 'typing', 
    //     op: 'start', 
    //     sender: 'hamlet@zulip.com',
    //     recipients: [{
    //       id: 1,
    //       email: 'othello@zulip.com'
    //     }]
    //   },
    //   {
    //     type: 'typing',
    //     op: 'stop',
    //     sender: 'hamlet@zulip.com',
    //     recipients: [{
    //       id: 1,
    //       email: 'othello@zulip.com'
    //     }]
    //   }]
    // } 
  });
});
```

# Testing

Use `npm test` to run the tests.

## Writing Tests

Currently, we have a simple testing framework which stubs our network
requests and also allows us to test the input passed to it. This is what
a sample test for an API endpoint looks like:

```js
const users = require('../../lib/resources/users'); // File to test.
const common = require('../common'); // Common functions for tests.

const chai = require('chai');
chai.use(require('chai-as-promised'));

chai.should();

describe('Users', () => {
  it('should fetch users', () => {
    const validator = (url, options) => { // Function to test the network request parameters.
      url.should.equal(`${common.config.apiURL}/users`);
      Object.keys(options.body.data).length.should.equal(4);
      options.body.data.subject.should.equal(params.subject);
      options.body.data.content.should.equal(params.content);
    };
    const output = { // The data returned by the API in JSON format.
      already_subscribed: {},
      result: 'success',
    };
    const stubs = common.getStubs(validator, output); // Stub the network modules.
    users(common.config).retrieve().should.eventually.have.property('result', 'success'); // Function call.
    common.restoreStubs(stubs); // Restore the stubs.
  });
});
```

Each pull request should contain relevant tests as well as example usage.
