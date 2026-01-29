import { expect } from 'chai';
import sinon from 'sinon';
import * as SessionStorageModule from '../../utils/sessionStorage';
import clearBotSessionStorageEventListener from '../../event-listeners/clearBotSessionStorageEventListener';

describe('clearBotSessionStorageEventListener', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should call clearBotSessionStorage when the before unload event is triggered', () => {
    const clearBotSessionStorageSpy = sandbox.spy(
      SessionStorageModule,
      'clearBotSessionStorage',
    );

    clearBotSessionStorageEventListener(false);
    window.dispatchEvent(new Event('beforeunload'));

    expect(clearBotSessionStorageSpy.calledOnce).to.be.true;
    expect(clearBotSessionStorageSpy.calledWith(false, false)).to.be.true;
  });

  it('should unregister the handler when the cleanup function is invoked', () => {
    const addEventListenerStub = sandbox.stub(window, 'addEventListener');
    const removeEventListenerStub = sandbox.stub(window, 'removeEventListener');
    let capturedHandler;
    addEventListenerStub.callsFake((event, handler) => {
      capturedHandler = handler;
    });

    const cleanup = clearBotSessionStorageEventListener(true);
    cleanup();

    expect(removeEventListenerStub.calledOnce).to.be.true;
    expect(removeEventListenerStub.firstCall.args[0]).to.equal('beforeunload');
    expect(removeEventListenerStub.firstCall.args[1]).to.equal(capturedHandler);
  });
});
