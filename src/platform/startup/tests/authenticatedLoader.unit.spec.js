import { expect } from 'chai';
import sinon from 'sinon';
import * as profileUtilities from 'platform/user/profile/utilities';
import { authenticatedLoader } from '../authenticatedLoader';

describe('authenticatedLoader', () => {
  const sandbox = sinon.createSandbox();
  let hasSessionStub;

  beforeEach(() => {
    hasSessionStub = sandbox.stub(profileUtilities, 'hasSession');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return null if user is not authenticated', async () => {
    hasSessionStub.returns(false);
    const loader = sinon.stub();
    const wrappedLoader = authenticatedLoader(loader);

    const result = await wrappedLoader();

    expect(result).to.be.null;
    expect(loader.called).to.be.false;
  });

  it('should call the loader if user is authenticated', async () => {
    hasSessionStub.returns(true);
    const loader = sinon.stub().resolves('data');
    const wrappedLoader = authenticatedLoader(loader);

    const result = await wrappedLoader('arg1', 'arg2');

    expect(result).to.equal('data');
    expect(loader.calledWith('arg1', 'arg2')).to.be.true;
  });

  it('should call the loader if user session is true', async () => {
    hasSessionStub.returns(true);
    const loader = sinon.stub().resolves('data');
    const wrappedLoader = authenticatedLoader(loader);

    const result = await wrappedLoader('arg1', 'arg2');

    expect(result).to.equal('data');
    expect(loader.calledWith('arg1', 'arg2')).to.be.true;
  });

  it('should call the loader if user session is "true"', async () => {
    hasSessionStub.returns('true');
    const loader = sinon.stub().resolves('data');
    const wrappedLoader = authenticatedLoader(loader);

    const result = await wrappedLoader('arg1', 'arg2');

    expect(result).to.equal('data');
    expect(loader.calledWith('arg1', 'arg2')).to.be.true;
  });
});
