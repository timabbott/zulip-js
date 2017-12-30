const streams = require('../../lib/resources/streams');
const common = require('../common');
const chai = require('chai');
chai.use(require('chai-as-promised'));

chai.should();

describe('Streams', () => {
  it('should fetch streams', () => {
    const validator = (url, options) => {
      url.should.contain(`${common.config.apiURL}/streams`);
      options.should.not.have.property('body');
    };
    const output = {
      result: 'success',
      msg: '',
      streams: [{
        name: 'Denmark',
        stream_id: 1,
        invite_only: false,
        description: 'A Scandinavian country',
      }, {
        name: 'Rome',
        stream_id: 2,
        invite_only: false,
        description: 'Yet another Italian city',
      }, {
        name: 'Scotland',
        stream_id: 3,
        invite_only: false,
        description: 'Located in the United Kingdom',
      }, {
        name: 'Venice',
        stream_id: 4,
        invite_only: false,
        description: 'A northeastern Italian city',
      }, {
        name: 'Verona',
        stream_id: 5,
        invite_only: false,
        description: 'A city in Italy',
      }],
    };
    const stubs = common.getStubs(validator, output);
    streams(common.config).retrieve().should.eventually.have.property('result', 'success');
    common.restoreStubs(stubs);
  });
  it('should fetch subscriptions', () => {
    const params = {
      subscriptions: JSON.stringify([{ name: 'off topic' }]),
    };
    const validator = (url, options) => {
      url.should.contain(`${common.config.apiURL}/users/me/subscriptions`);
      options.should.not.have.property('body');
      const urldata = url.split('?', 2)[1].split('&'); // URL: host/streams?key=value&key=value...
      urldata.length.should.equal(1);
      urldata.should.contain(`subscriptions=${params.subscriptions}`);
    };
    const output = {
      msg: '',
      result: 'success',
      subscriptions: [{
        color: '#e79ab5',
        invite_only: false,
        desktop_notifications: true,
        subscribers: [Object],
        stream_id: 1,
        pin_to_top: false,
        email_address: 'Denmark+986326cbbaef74fcb4c77cc41d47b12c@zulipdev.com:9991',
        audible_notifications: true,
        description: 'A Scandinavian country',
        in_home_view: true,
        push_notifications: false,
        name: 'Denmark',
      }, {
        color: '#e79ab5',
        invite_only: false,
        desktop_notifications: true,
        subscribers: [Object],
        stream_id: 3,
        pin_to_top: false,
        email_address: 'Scotland+a3a2dc96b0406d47c826041f773ee29a@zulipdev.com:9991',
        audible_notifications: true,
        description: 'Located in the United Kingdom',
        in_home_view: true,
        push_notifications: false,
        name: 'Scotland',
      }],
    };
    const stubs = common.getStubs(validator, output);
    streams(common.config).subscriptions.retrieve(params).should.eventually.have.property('result', 'success');
    common.restoreStubs(stubs);
  });
});
