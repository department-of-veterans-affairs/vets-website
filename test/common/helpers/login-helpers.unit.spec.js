import { expect } from 'chai';
import sinon from 'sinon';

import { handleVerify } from '../../../src/js/common/helpers/login-helpers.js';

describe('Login helpers unit tests', () => {
  describe('handleVerify', () => {
    const realFetch = global.fetch;
    const realWindow = global.window;

    const fetchStub = sinon.stub();
    const openSpy = sinon.spy();

    beforeEach(() => {
      global.fetch = fetchStub;
      global.window = { open: openSpy, dataLayer: [] };
    });

    afterEach(() => {
      global.fetch = realFetch;
      global.window = realWindow;
    });

    it('should make a fetch request and open a popup', () => {
      fetchStub.returns({
        then: (fn) => fn({ json: () => Promise.resolve() })
      });
      handleVerify();
      expect(fetchStub.calledWith(sinon.match(/.*\/v0\/sessions\/new/),
                                  sinon.match({ method: 'GET' })));
      expect(window.open.calledWith(''));
    });
  });
});
