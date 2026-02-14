import { expect } from 'chai';
import sinon from 'sinon';

import { identifyZetaUser, clearZetaIdentity } from '../identity';

describe('identifyZetaUser', () => {
  let btStub;

  beforeEach(() => {
    btStub = sinon.stub();
    global.window.bt = btStub;
  });

  afterEach(() => {
    global.window.bt = () => {};
  });

  it('should call bt("updateUser") with user_id from profile', () => {
    identifyZetaUser({ accountUuid: 'test-uuid-123' });
    expect(btStub.calledOnce).to.be.true;
    expect(btStub.firstCall.args[0]).to.equal('updateUser');
    expect(btStub.firstCall.args[1]).to.deep.equal({
      user_id: 'test-uuid-123',
    });
  });

  it('should not call bt when profile is null', () => {
    identifyZetaUser(null);
    expect(btStub.called).to.be.false;
  });

  it('should not call bt when accountUuid is missing', () => {
    identifyZetaUser({ name: 'Test User' });
    expect(btStub.called).to.be.false;
  });

  it('should not call bt when window.bt is not available', () => {
    global.window.bt = undefined;
    expect(() => identifyZetaUser({ accountUuid: 'uuid' })).to.not.throw();
  });
});

describe('clearZetaIdentity', () => {
  let btStub;

  beforeEach(() => {
    btStub = sinon.stub();
    global.window.bt = btStub;
  });

  afterEach(() => {
    global.window.bt = () => {};
  });

  it('should call bt("clearSessionIdentity")', () => {
    clearZetaIdentity();
    expect(btStub.calledOnce).to.be.true;
    expect(btStub.firstCall.args[0]).to.equal('clearSessionIdentity');
  });

  it('should not throw when window.bt is not available', () => {
    global.window.bt = undefined;
    expect(() => clearZetaIdentity()).to.not.throw();
  });
});
