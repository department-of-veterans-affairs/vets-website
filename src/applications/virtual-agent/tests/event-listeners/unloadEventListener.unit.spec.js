import { expect } from 'chai';
import sinon from 'sinon';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import UnloadEventListener from '../../event-listeners/unloadEventListener';

describe('UnloadEventListener', () => {
  let sandbox;
  let useSendEventStub;
  let sendEventStub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sendEventStub = sandbox.stub();
    useSendEventStub = sandbox.stub().returns(sendEventStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should add a beforeunload event listener that sends an endOfConversation event', () => {
    const addEventListenerStub = sandbox.stub(window, 'addEventListener');
    renderHook(() => UnloadEventListener({ useSendEvent: useSendEventStub }));

    expect(
      addEventListenerStub.calledWithExactly('beforeunload', sinon.match.func),
    ).to.be.true;
  });

  it('should call send event when before unload event fires', async () => {
    renderHook(() => UnloadEventListener({ useSendEvent: useSendEventStub }));
    await act(async () => {
      window.dispatchEvent(new Event('beforeunload'));
    });

    expect(sendEventStub.calledOnce).to.be.true;
    expect(sendEventStub.firstCall.args[0]).to.equal('endOfConversation');
  });

  it('should return false', () => {
    const { result } = renderHook(() =>
      UnloadEventListener({ useSendEvent: useSendEventStub }),
    );
    expect(result.current).to.equal(false);
  });
});
