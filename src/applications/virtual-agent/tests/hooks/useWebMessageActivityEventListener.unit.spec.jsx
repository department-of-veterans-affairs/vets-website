import sinon from 'sinon';
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import * as sessionStorageModule from '../../utils/sessionStorage';
import useWebMessageActivityEventListener from '../../hooks/useWebMessageActivityEventListener';

describe('useWebMessageActivityEventListener', () => {
  let sandbox;
  let clock;
  const now = new Date();

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sinon.useFakeTimers({
      now,
      toFake: ['Date'],
    });
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  it('should call addEventListener', () => {
    const addEventListenerStub = sandbox.stub(window, 'addEventListener');

    renderHook(() => useWebMessageActivityEventListener(now));

    expect(
      addEventListenerStub.calledWithExactly(
        'webchat-message-activity',
        sinon.match.func,
      ),
    ).to.be.true;
  });

  it('should call storeUtterances', async () => {
    const storeUtterancesStub = sandbox.stub(
      sessionStorageModule,
      'storeUtterances',
    );

    renderHook(() => useWebMessageActivityEventListener());
    await act(async () => {
      window.dispatchEvent(new Event('webchat-message-activity'));
    });

    expect(storeUtterancesStub.calledOnce).to.be.true;
  });
});
