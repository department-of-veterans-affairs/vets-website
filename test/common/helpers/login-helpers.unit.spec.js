import { expect } from 'chai';
import sinon from 'sinon';

import { handleVerify } from '../../../src/js/common/helpers/login-helpers.js';

class Dummy {
  constructor() {
    this.handleVerify = handleVerify;
  }
}

describe('Login helpers unit tests', () => {
  describe('handleVerify', () => {
    const dummy = new Dummy;

    const realFetch = global.fetch;
    const realWindow = global.window;

    const fetchStub = sinon.stub();
    const openSpy = sinon.spy();

    beforeEach(() => {
      global.fetch = fetchStub;
      global.window = { open: openSpy };
    });

    afterEach(() => {
      global.fetch = realFetch;
      global.window = realWindow;
    });

    it('should open a window and make a fetch request', () => {
      fetchStub.returns({
        then: (fn) => fn({ json: () => Promise.resolve() })
      });
      dummy.handleVerify();
      expect(window.open.calledWith(''));
      expect(fetchStub.calledWith(sinon.match(/.*\/v0\/sessions\/new/),
                                  sinon.match({ method: 'GET' })));
    });
  });
});
