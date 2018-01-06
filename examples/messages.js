const zulip = require('../lib/');

const stream = 'test-bot';

const sendParams = {
  to: stream,
  type: 'stream',
  subject: 'Testing zulip-js',
  content: 'Something is wrong....',
};

const config = {
  username: process.env.ZULIP_USERNAME,
  password: process.env.ZULIP_PASSWORD,
  realm: process.env.ZULIP_REALM,
};

zulip(config).then((z) => {
  // Send a message
  z.messages.send(sendParams).then((res) => {
    // Response includes Message ID
    console.log(res);
    const readParams = {
      stream,
      type: 'stream',
      anchor: res.id,
      num_before: 1,
      num_after: 1,
    };
    // Fetch messages anchored around id (1 before, 1 after)
    z.messages.retrieve(readParams).then(console.log);
    // Fetch most recent message
    readParams.anchor = 1000000000;
    z.messages.retrieve(readParams).then(console.log);
    // Get the id for the last message the user read
    z.users.me.pointer.retrieve().then((resp) => {
      // Fetch the messages around the last message that the user read
      readParams.anchor = resp.pointer;
      z.messages.retrieve(readParams).then(console.log);
    });

    // Mark the last message as unread
    const flagParams = {
      messages: [readParams.anchor],
      flag: 'read',
    };
    z.messages(config).flags.remove(flagParams).then(console.log);

    // Mark the last message as read
    z.messages(config).flags.add(flagParams).then(console.log);
  }).then(res => console.log(res.messages));
}).catch(err => console.log(err.message));
