import { expect } from 'chai';
import sinon from 'sinon';

import { handleVerify } from '../../../src/js/common/helpers/login-helpers.js';

let windowOpen;
let oldWindow;

const fakeWindow = () => {
  oldWindow = global.window;
  windowOpen = sinon.stub().returns({ focus: f => f });
  global.window = {
    open: windowOpen,
    dataLayer: []
  };
};

const restoreWindow = () => {
  global.window = oldWindow;
};

describe('handleVerify', () => {
  beforeEach(fakeWindow);
  it('should open window', () => {
    handleVerify('http://fake-verify-url');
    expect(windowOpen.called).to.be.true;
  });
  afterEach(restoreWindow);
});
