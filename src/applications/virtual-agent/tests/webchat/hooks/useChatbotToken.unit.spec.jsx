import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import TOGGLE_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import useChatbotToken from '../../../webchat/hooks/useChatbotToken';
import { EXPIRY_ALERT_BUFFER_MS } from '../../../webchat/utils/expiry';
import { COMPLETE } from '../../../webchat/utils/loadingStatus';
import * as RetryOnce from '../../../webchat/utils/retryOnce';

describe('useChatbotToken', () => {
  let sandbox;
  const createWrapper = (persist = false) => {
    const initialState = {
      featureToggles: {
        loading: false,
        [TOGGLE_NAMES.virtualAgentChatbotSessionPersistenceEnabled]: persist,
      },
    };
    const store = createStore((state = initialState) => state);
    // eslint-disable-next-line react/prop-types
    return ({ children }) => <Provider store={store}>{children}</Provider>;
  };

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    sessionStorage.clear();
  });

  afterEach(() => {
    sandbox.restore();
    sessionStorage.clear();
  });

  describe('useChatbotToken', () => {
    it('should return token loadingStatus', async () => {
      sandbox.stub(RetryOnce, 'default').resolves({
        token: 'abc',
        conversationId: 'cid-1',
        code: 'code-1',
      });

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(false),
        });
      });

      expect(result.result.current.token).to.equal('abc');
      expect(result.result.current.loadingStatus).to.equal(COMPLETE);
    });

    it('should store new token and conversationId on fresh session', async () => {
      sandbox.stub(RetryOnce, 'default').resolves({
        token: 't-new',
        conversationId: 'c-new',
        code: 'code-new',
      });

      await act(async () => {
        renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(false),
        });
      });

      expect(sessionStorage.getItem('va-bot.token')).to.equal('t-new');
      expect(sessionStorage.getItem('va-bot.conversationId')).to.equal('c-new');
      expect(sessionStorage.getItem('va-bot.code')).to.equal('code-new');
    });

    it('should start new session if metadata (expiry) is missing', async () => {
      // Pre-populate existing values
      sessionStorage.setItem('va-bot.token', 't-existing');
      sessionStorage.setItem('va-bot.conversationId', 'c-existing');
      sessionStorage.setItem('va-bot.code', 'code-existing');

      const retryStub = sandbox.stub(RetryOnce, 'default').resolves({
        token: 't-new',
        conversationId: 'c-new',
        code: 'code-new',
        expiresIn: 3600,
      });

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(true),
        });
      });

      // Should use NEW token because expiry was missing
      expect(result.result.current.token).to.equal('t-new');
      expect(result.result.current.loadingStatus).to.equal(COMPLETE);
      expect(retryStub.called).to.be.true;

      expect(sessionStorage.getItem('va-bot.token')).to.equal('t-new');
      expect(sessionStorage.getItem('va-bot.conversationId')).to.equal('c-new');
      expect(sessionStorage.getItem('va-bot.code')).to.equal('code-new');
    });

    it('should start new session if code is missing', async () => {
      // Pre-populate existing token/conversationId but no code
      sessionStorage.setItem('va-bot.token', 't-existing');
      sessionStorage.setItem('va-bot.conversationId', 'c-existing');

      const retryStub = sandbox.stub(RetryOnce, 'default').resolves({
        token: 't-new',
        conversationId: 'c-new',
        code: 'code-new',
      });

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(true),
        });
      });

      // Should use NEW token because code was missing
      expect(result.result.current.token).to.equal('t-new');
      expect(result.result.current.loadingStatus).to.equal(COMPLETE);
      expect(retryStub.calledOnce).to.be.true;
      expect(sessionStorage.getItem('va-bot.token')).to.equal('t-new');
      expect(sessionStorage.getItem('va-bot.conversationId')).to.equal('c-new');
      expect(sessionStorage.getItem('va-bot.code')).to.equal('code-new');
    });

    it('should set expired=true when within alert buffer window', async () => {
      // Pre-populate existing values and expiry near buffer threshold
      sessionStorage.setItem('va-bot.token', 't-existing');
      sessionStorage.setItem('va-bot.conversationId', 'c-existing');
      const expiresSoon = Date.now() + EXPIRY_ALERT_BUFFER_MS - 1000;
      sessionStorage.setItem('va-bot.tokenExpiresAt', String(expiresSoon));

      // Ensure no additional fetch occurs when within buffer
      const retryStub = sandbox
        .stub(RetryOnce, 'default')
        .resolves({ token: 't-new', conversationId: 'c-new' });

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(true),
        });
      });

      expect(result.result.current.token).to.equal('t-existing');
      expect(result.result.current.loadingStatus).to.equal(COMPLETE);
      expect(result.result.current.expired).to.equal(true);
      expect(retryStub.called).to.be.false;
    });

    it('should clear session and fetch new token on va-chatbot-reset', async () => {
      // Pre-populate existing
      sessionStorage.setItem('va-bot.token', 't-existing');
      sessionStorage.setItem('va-bot.conversationId', 'c-existing');
      sessionStorage.setItem('va-bot.code', 'code-old');
      sessionStorage.setItem(
        'va-bot.tokenExpiresAt',
        String(Date.now() + 300000),
      );

      const retryStub = sandbox.stub(RetryOnce, 'default').resolves({
        token: 't-new',
        conversationId: 'c-new',
        code: 'code-new',
        expiresIn: 3600,
      });

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(true),
        });
      });
      expect(result.result.current.token).to.equal('t-existing');

      // Trigger reset
      await act(async () => {
        window.dispatchEvent(new Event('va-chatbot-reset'));
      });

      // Ensure token fetched and storage updated
      expect(retryStub.called).to.be.true;
      expect(sessionStorage.getItem('va-bot.token')).to.equal('t-new');
      expect(sessionStorage.getItem('va-bot.conversationId')).to.equal('c-new');
      expect(sessionStorage.getItem('va-bot.code')).to.equal('code-new');
      expect(result.result.current.token).to.equal('t-new');
    });

    it('should run the effect only once on mount (no duplicate fetches)', async () => {
      const retryStub = sandbox.stub(RetryOnce, 'default').resolves({
        token: 'abc',
        conversationId: 'cid-1',
      });

      let rendered;
      await act(async () => {
        rendered = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(false),
        });
      });
      // Re-render the hook to simulate component re-render
      await act(async () => {
        rendered.rerender();
      });

      expect(retryStub.calledOnce).to.be.true;
    });

    it('should flip expired to true after scheduled timer passes threshold', async () => {
      // Persistence on with existing token
      sessionStorage.setItem('va-bot.token', 't-existing');
      sessionStorage.setItem('va-bot.conversationId', 'c-existing');
      // Prevent meta fetch (code missing would trigger it)
      sessionStorage.setItem('va-bot.code', 'code-existing');
      // Set expiry so alert target is ~50ms from now
      const now = Date.now();
      const targetAlertMs = 50; // small, keep test fast
      const expiresAt = now + EXPIRY_ALERT_BUFFER_MS + targetAlertMs;
      sessionStorage.setItem('va-bot.tokenExpiresAt', String(expiresAt));

      // No network fetch needed for this scenario
      sandbox.stub(RetryOnce, 'default').resolves({});

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(true),
        });
      });

      // Initially not expired
      expect(result.result.current.expired).to.equal(false);
      // Wait beyond the scheduled delay; give buffer for CI
      await new Promise(res => setTimeout(res, targetAlertMs + 75));
      // Re-read hook state
      expect(result.result.current.expired).to.equal(true);
    });

    it('should set expired=true on focus event after threshold', async () => {
      sessionStorage.setItem('va-bot.token', 't-existing');
      sessionStorage.setItem('va-bot.conversationId', 'c-existing');
      // Prevent meta fetch that would reset expiresAt
      sessionStorage.setItem('va-bot.code', 'code-existing');
      const realNow = Date.now();
      const expiresAt = realNow + EXPIRY_ALERT_BUFFER_MS + 2000; // 2s beyond buffer
      sessionStorage.setItem('va-bot.tokenExpiresAt', String(expiresAt));

      sandbox.stub(RetryOnce, 'default').resolves({});

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(true),
        });
      });
      expect(result.result.current.expired).to.equal(false);

      // Jump time to after alert threshold using Date.now stub
      const nowStub = sandbox.stub(Date, 'now').returns(
        // just after alert target
        expiresAt - EXPIRY_ALERT_BUFFER_MS + 50,
      );
      try {
        // Trigger focus re-check
        await act(async () => {
          window.dispatchEvent(new Event('focus'));
        });
        expect(result.result.current.expired).to.equal(true);
      } finally {
        nowStub.restore();
      }
    });

    it('should set expired=true on connection error event', async () => {
      // Persistence on
      sessionStorage.setItem('va-bot.token', 't-existing');
      sessionStorage.setItem('va-bot.conversationId', 'c-existing');
      const expiresAtFuture = Date.now() + 10 * 60 * 1000; // far in future
      sessionStorage.setItem('va-bot.tokenExpiresAt', String(expiresAtFuture));

      sandbox.stub(RetryOnce, 'default').resolves({});

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(true),
        });
      });
      expect(result.result.current.expired).to.equal(false);

      await act(async () => {
        window.dispatchEvent(new Event('va-chatbot-connection-error'));
      });
      expect(result.result.current.expired).to.equal(true);
    });
  });
});
