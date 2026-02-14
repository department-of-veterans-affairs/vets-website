import { expect } from 'chai';
import sinon from 'sinon';

import { canInitZeta, initializeZeta, resetZetaInit } from '../index';

describe('canInitZeta', () => {
  it('should return true in non-localhost, non-test environments', () => {
    const env = { isLocalhost: () => false };
    const win = {};
    expect(canInitZeta(env, win)).to.be.true;
  });

  it('should return false on localhost', () => {
    const env = { isLocalhost: () => true };
    const win = {};
    expect(canInitZeta(env, win)).to.be.false;
  });

  it('should return false in Mocha', () => {
    const env = { isLocalhost: () => false };
    const win = { Mocha: true };
    expect(canInitZeta(env, win)).to.be.false;
  });

  it('should return false in Cypress', () => {
    const env = { isLocalhost: () => false };
    const win = { Cypress: true };
    expect(canInitZeta(env, win)).to.be.false;
  });
});

describe('initializeZeta', () => {
  let createElementStub;
  let appendChildStub;

  beforeEach(() => {
    resetZetaInit();
    appendChildStub = sinon.stub();
    createElementStub = sinon.stub(document, 'createElement').returns({
      set async(val) {
        this._async = val;
      },
      get async() {
        return this._async;
      },
      set src(val) {
        this._src = val;
      },
      get src() {
        return this._src;
      },
    });
    sinon.stub(document.body, 'appendChild').callsFake(appendChildStub);
  });

  afterEach(() => {
    createElementStub.restore();
    document.body.appendChild.restore();
    resetZetaInit();
  });

  it('should create a script element when initialization is allowed', () => {
    const checkInit = () => true;
    initializeZeta(checkInit);
    expect(createElementStub.calledWith('script')).to.be.true;
    expect(appendChildStub.calledOnce).to.be.true;
  });

  it('should not initialize when checkInit returns false', () => {
    const checkInit = () => false;
    initializeZeta(checkInit);
    expect(appendChildStub.called).to.be.false;
  });

  it('should not double-initialize', () => {
    const checkInit = () => true;
    initializeZeta(checkInit);
    initializeZeta(checkInit);
    expect(appendChildStub.calledOnce).to.be.true;
  });
});
