const chai = require('chai');
const lib = require('../lib/index');
const common = require('./common');
chai.use(require('chai-as-promised'));

chai.should();

const params = {
  one: '123',
  two: '456',
};

const output = {
  data: 'random',
  msg: '',
  result: 'success',
};

describe('Index', () => {
  it('should call get endpoints', (done) => {
    const validator = (url, options) => {
      url.should.contain(`${common.config.apiURL}/testurl`);
      options.method.should.be.equal('GET');
      options.should.not.have.property('body');
      [...new URL(url).searchParams].should.have.deep.members([
        ['one', params.one],
        ['two', params.two],
      ]);
    };
    lib(common.config).then((z) => {
      const stubs = common.getStubs(validator, output);
      z.callEndpoint('/testurl', 'GET', params)
        .should.eventually.have.property('result', 'success');
      common.restoreStubs(stubs);
      return lib(common.config);
    }).then((z) => {
      const stubs = common.getStubs(validator, output);
      z.callEndpoint('testurl', 'GET', params)
        .should.eventually.have.property('result', 'success');
      common.restoreStubs(stubs);
      done();
    }).catch(done);
  });
  it('should call post endpoints', (done) => {
    const validator = (url, options) => {
      url.should.contain(`${common.config.apiURL}/testurl`);
      options.method.should.be.equal('POST');
      Object.keys(options.body.data).length.should.equal(2);
      options.body.data.one.should.equal(params.one);
      options.body.data.two.should.equal(params.two);
    };
    lib(common.config).then((z) => {
      const stubs = common.getStubs(validator, output);
      z.callEndpoint('/testurl', 'POST', params)
        .should.eventually.have.property('result', 'success');
      common.restoreStubs(stubs);
      return lib(common.config);
    }).then((z) => {
      const stubs = common.getStubs(validator, output);
      z.callEndpoint('testurl', 'POST', params)
        .should.eventually.have.property('result', 'success');
      common.restoreStubs(stubs);
      done();
    }).catch(done);
  });
});
