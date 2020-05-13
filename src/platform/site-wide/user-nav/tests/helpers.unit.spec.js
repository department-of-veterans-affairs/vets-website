import { expect } from 'chai';
import sinon from 'sinon';

import * as authUtils from 'platform/user/authentication/utilities';
import localStorage from 'platform/utilities/storage/localStorage';

import { parseqs, checkAutoSession } from '../helpers';

describe('parseqs', () => {
  it('should parse string with/without leading ?', () => {
    expect(parseqs('?key=v')).to.eql({ key: 'v' });
    expect(parseqs('key=v')).to.eql({ key: 'v' });
  });

  it('should parse multiple values', () => {
    expect(parseqs('a=1&b=2')).to.eql({ a: '1', b: '2' });
  });

  it('should parse empty or no value qs', () => {
    expect(parseqs('')).to.eql({});
    expect(parseqs('noval')).to.eql({ noval: undefined });
  });

  it('should use last value when duplicate keys are provided', () => {
    expect(parseqs('k=1&k=2')).to.eql({ k: '2' });
  });
});

describe('checkAutoSession', () => {
  afterEach(() => localStorage.clear());

  it('should auto logout if user is logged in and they do not have a SSOe session', () => {
    localStorage.setItem('hasSession', true);
    localStorage.setItem('hasSessionSSO', false);
    const stub = sinon.stub(authUtils, 'autoLogout');
    checkAutoSession().then(() => {
      sinon.assert.calledOnce(stub);
    });
    stub.restore();
  });

  it('should not auto logout if user is logged in and they have a SSOe session', () => {
    localStorage.setItem('hasSession', true);
    localStorage.setItem('hasSessionSSO', true);
    const stub = sinon.stub(authUtils, 'autoLogout');
    checkAutoSession().then(() => {
      sinon.assert.notCalled(stub);
    });
    stub.restore();
  });

  it('should not auto logout if user is logged in and we dont know if they have a SSOe session', () => {
    localStorage.setItem('hasSession', true);
    const stub = sinon.stub(authUtils, 'autoLogout');
    checkAutoSession().then(() => {
      sinon.assert.notCalled(stub);
    });
    stub.restore();
  });

  it('should auto login if user is logged out, they have a SSOe session and dont need to force auth', () => {
    localStorage.setItem('hasSessionSSO', true);
    const stub = sinon.stub(authUtils, 'autoLogin');
    checkAutoSession().then(() => {
      sinon.assert.calledOnce(stub);
    });
    stub.restore();
  });

  it('should not auto login if user is logged out, they dont have a SSOe session and dont need to force auth', () => {
    localStorage.setItem('hasSessionSSO', false);
    const stub = sinon.stub(authUtils, 'autoLogin');
    checkAutoSession().then(() => {
      sinon.assert.notCalled(stub);
    });
    stub.restore();
  });

  it('should not auto login if user is logged out, they have a SSOe session and need to force auth', () => {
    localStorage.setItem('hasSessionSSO', true);
    localStorage.setItem('requiresForceAuth', true);
    const stub = sinon.stub(authUtils, 'autoLogin');
    checkAutoSession().then(() => {
      sinon.assert.notCalled(stub);
    });
    stub.restore();
  });

  it('should invoke callback if provided', () => {
    const callback = sinon.spy();
    checkAutoSession().then(() => {
      sinon.assert.calledOnce(callback);
    });
  });
});
