import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import useWebMessageActivityEventListener from '../../../webchat/hooks/useWebMessageActivityEventListener';
import * as sessionStorageModule from '../../../webchat/utils/sessionStorage';

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
