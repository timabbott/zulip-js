const chai = require('chai');
const events = require('../../lib/resources/events');
const common = require('../common');
chai.use(require('chai-as-promised'));

chai.should();

describe('Events', () => {
  it('should fetch events', (done) => {
    const params = {
      last_event_id: -1,
      dont_block: true,
    };
    const validator = (url, options) => {
      url.should.contain(`${common.config.apiURL}/events`);
      options.method.should.be.equal('GET');
      options.should.not.have.property('body');
      const urldata = url.split('?', 2)[1].split('&'); // URL: host/messages?key=value&key=value...
      urldata.length.should.equal(2);
      urldata.should.contain(`last_event_id=${params.last_event_id}`);
      urldata.should.contain(`dont_block=${params.dont_block}`);
    };
    const output = {
      events: [{
        id: 0,
        message: [Object],
        type: 'message',
        flags: [Object],
      }],
      result: 'success',
      msg: '',
      queue_id: '1511901550:3',
    };
    const stubs = common.getStubs(validator, output);
    events(common.config).retrieve(params)
      .then((data) => {
        data.should.have.property('result', 'success');
        common.restoreStubs(stubs);
        done();
      }).catch(done);
  });
});
