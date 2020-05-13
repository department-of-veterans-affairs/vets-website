import { expect } from 'chai';
import sinon from 'sinon';

import * as authUtils from 'platform/user/authentication/utilities';
import * as ssoUtils from 'platform/utilities/sso';
import * as profUtils from 'platform/user/profile/utilities';

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
  it('should auto logout if user is logged in and they do not have a SSOe session', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(true);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(false);
    sandbox.stub(ssoUtils, 'getForceAuth').returns(undefined);
    const auto = sandbox.stub(authUtils, 'autoLogout');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.calledOnce(auto);
  });

  it('should not auto logout if user is logged in and they have a SSOe session', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(true);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(true);
    sandbox.stub(ssoUtils, 'getForceAuth').returns(undefined);
    const auto = sandbox.stub(authUtils, 'autoLogout');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });

  it('should not auto logout if user is logged in and we dont know if they have a SSOe session', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(true);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(null);
    sandbox.stub(ssoUtils, 'getForceAuth').returns(undefined);
    const auto = sandbox.stub(authUtils, 'autoLogout');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });

  it('should auto login if user is logged out, they have a SSOe session and dont need to force auth', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(true);
    sandbox.stub(ssoUtils, 'getForceAuth').returns(undefined);
    const auto = sandbox.stub(authUtils, 'autoLogin');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.calledOnce(auto);
  });

  it('should not auto login if user is logged out, they dont have a SSOe session and dont need to force auth', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(false);
    sandbox.stub(ssoUtils, 'getForceAuth').returns(undefined);
    const auto = sandbox.stub(authUtils, 'autoLogin');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });

  it('should not auto login if user is logged out, they have a SSOe session and need to force auth', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(true);
    sandbox.stub(ssoUtils, 'getForceAuth').returns(true);
    const auto = sandbox.stub(authUtils, 'autoLogin');
    await checkAutoSession();
    sandbox.restore();
    sinon.assert.notCalled(auto);
  });

  it('should invoke callback if provided', async () => {
    const sandbox = sinon.createSandbox();
    sandbox.stub(profUtils, 'hasSession').returns(false);
    sandbox.stub(profUtils, 'hasSessionSSO').returns(false);
    sandbox.stub(ssoUtils, 'getForceAuth').returns(undefined);
    const callback = sandbox.spy();
    await checkAutoSession(callback);
    sandbox.restore();
    sinon.assert.calledOnce(callback);
  });
});
