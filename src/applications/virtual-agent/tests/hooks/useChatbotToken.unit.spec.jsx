import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it } from 'mocha';
import { act } from 'react-dom/test-utils';
import { renderHook } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import TOGGLE_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import * as RetryOnce from '../../utils/retryOnce';
import useChatbotToken from '../../hooks/useChatbotToken';
import { COMPLETE } from '../../utils/loadingStatus';

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
    });

    it('should reuse existing token/conversationId and not fetch again', async () => {
      // Pre-populate existing values
      sessionStorage.setItem('va-bot.token', 't-existing');
      sessionStorage.setItem('va-bot.conversationId', 'c-existing');

      const retryStub = sandbox.stub(RetryOnce, 'default').resolves({
        token: 't-should-not-be-used',
        conversationId: 'c-should-not-be-used',
      });

      let result;
      await act(async () => {
        result = renderHook(() => useChatbotToken(), {
          wrapper: createWrapper(true),
        });
      });

      expect(result.result.current.token).to.equal('t-existing');
      expect(result.result.current.loadingStatus).to.equal(COMPLETE);
      expect(retryStub.called).to.be.false; // no fetch when values exist
      // Ensure values not overwritten
      expect(sessionStorage.getItem('va-bot.token')).to.equal('t-existing');
      expect(sessionStorage.getItem('va-bot.conversationId')).to.equal(
        'c-existing',
      );
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
  });
});
