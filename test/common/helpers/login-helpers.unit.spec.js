import { expect } from 'chai';
import sinon from 'sinon';

import { handleVerify } from '../../../src/js/common/helpers/login-helpers.js';

// Does this need to be a React class in order for something to magically call this.serverRequest()?
class Dummy {
  constructor() {
    this.handleVerify = handleVerify;
  }
}

describe('Login helpers unit tests', () => {
  describe('handleVerify', () => {
    const realFetch = global.fetch;
    const realWindow = global.window;

    const fetchStub = sinon.stub();
    const openCallback = sinon.spy();

    beforeEach(() => {
      global.fetch = fetchStub;
      global.window = { open: openCallback };
    });

    afterEach(() => {
      global.fetch = realFetch;
      global.window = realWindow;
    });

    it('should make a fetch request', () => {
      const dummy = new Dummy;
      fetchStub.returns({
        then: (fn) => fn({ ok: true, json: () => Promise.resolve() })
      });

      // All of these assertions fail... :(
      expect(openCallback).to.have.been.called(); // trying something simple first
      // expect(openCallback.calledWith(url, '_blank', 'params')).to.be.true;
      expect(fetchStub.firstCall.args[0]).to.contain('/v0/sessions/new');
      expect(fetchStub.firstCall.args[1].method).to.equal('GET');
      expect(fetchStub.called).to.be.true;

      dummy.handleVerify();
    });
  });
});
