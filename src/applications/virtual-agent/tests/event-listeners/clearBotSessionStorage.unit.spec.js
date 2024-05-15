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
});
