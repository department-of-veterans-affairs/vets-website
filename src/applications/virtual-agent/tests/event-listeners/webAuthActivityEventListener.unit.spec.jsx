import sinon from 'sinon';
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';
import * as SessionStorageModule from '../../utils/sessionStorage';
import webAuthActivityEventListener from '../../event-listeners/webAuthActivityEventListener';

describe('webAuthActivityEventListener', () => {
  let sandbox;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  it('should call setIsLoggingIn after 2 seconds', () => {
    const setIsAuthTopic = sandbox.stub();
    const addEventListenerStub = sandbox.stub(window, 'addEventListener');

    webAuthActivityEventListener(true, setIsAuthTopic);
    clock.tick(2000);

    expect(addEventListenerStub.calledOnce).to.be.true;
    expect(
      addEventListenerStub.calledWithExactly(
        'webchat-auth-activity',
        sinon.match.func,
      ),
    ).to.be.true;
  });

  it('should call setLoggedInFlow and setIsAuthTopic if isLoggedIn is false', async () => {
    const setIsAuthTopic = sandbox.stub();
    const setLoggedInFlowStub = sandbox.stub(
      SessionStorageModule,
      'setLoggedInFlow',
    );
    webAuthActivityEventListener(false, setIsAuthTopic);

    await act(async () => {
      window.dispatchEvent(new Event('webchat-auth-activity'));
    });

    clock.tick(2000);

    expect(setLoggedInFlowStub.calledOnce).to.be.true;
    expect(setLoggedInFlowStub.calledWithExactly('true')).to.be.true;

    expect(setIsAuthTopic.calledOnce).to.be.true;
    expect(setIsAuthTopic.calledWithExactly(true)).to.be.true;
  });

  it('should call setLoggedInFlow and setIsAuthTopic if isLoggedIn is true', async () => {
    const setIsAuthTopic = sandbox.stub();
    const setLoggedInFlowStub = sandbox.stub(
      SessionStorageModule,
      'setLoggedInFlow',
    );

    webAuthActivityEventListener(true, setIsAuthTopic);

    await act(async () => {
      window.dispatchEvent(new Event('webchat-auth-activity'));
    });

    clock.tick(2000);

    expect(setLoggedInFlowStub.notCalled).to.be.true;
    expect(setIsAuthTopic.notCalled).to.be.true;
  });
});
