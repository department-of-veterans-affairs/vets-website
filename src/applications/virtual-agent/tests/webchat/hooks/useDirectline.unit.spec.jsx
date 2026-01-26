import { act, renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import TOGGLE_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import sinon from 'sinon';
import useDirectLine from '../../../webchat/hooks/useDirectline';
import * as SessionStorageModule from '../../../webchat/utils/sessionStorage';

const publicDirectLine =
  'https://northamerica.directline.botframework.com/v3/directline';
const localDirectLine = 'http://localhost:3002/v3/directline';
const sessionToken = 'fake-session-token';
const sessionConversationIdKey = 'fake-session-conversation-id';

describe('directline', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  const stubUseLocalDirectline = useLocalDirectline => {
    sandbox.stub(process, 'env').value({
      ...process.env,
      USE_LOCAL_DIRECTLINE: useLocalDirectline,
    });
  };

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

  const setSessionStorageBase = () => {
    sandbox
      .stub(SessionStorageModule, SessionStorageModule.getTokenKey.name)
      .returns(sessionToken);

    sandbox
      .stub(
        SessionStorageModule,
        SessionStorageModule.getConversationIdKey.name,
      )
      .returns(sessionConversationIdKey);
  };

  describe('useDirectLine', () => {
    it('should call local directline when USE_LOCAL_DIRECTLINE is true', () => {
      const createDirectLineFn = sandbox.spy();
      stubUseLocalDirectline(true);
      setSessionStorageBase();

      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(false),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(localDirectLine);
      expect(createDirectLineFn.args[0][0]).to.not.have.property(
        'conversationId',
      );
      expect(createDirectLineFn.args[0][0]).to.not.have.property('watermark');
    });
    it('should call public directline when USE_LOCAL_DIRECTLINE is false', () => {
      const createDirectLineFn = sandbox.spy();
      stubUseLocalDirectline(false);
      setSessionStorageBase();

      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(false),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(publicDirectLine);
      expect(createDirectLineFn.args[0][0]).to.not.have.property(
        'conversationId',
      );
      expect(createDirectLineFn.args[0][0]).to.not.have.property('watermark');
    });
    it('should call public directline when USE_LOCAL_DIRECTLINE is not set', () => {
      const createDirectLineFn = sandbox.spy();
      stubUseLocalDirectline('');
      setSessionStorageBase();

      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(false),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(publicDirectLine);
      expect(createDirectLineFn.args[0][0]).to.not.have.property(
        'conversationId',
      );
    });
    it('should not include conversationId when persistence is disabled', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorageBase();
      stubUseLocalDirectline(false);

      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(false),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token: sessionToken,
          domain: publicDirectLine,
        }),
      ).to.be.true;
    });
    it('should not include conversationId on connection when persistence is disabled', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorageBase();
      stubUseLocalDirectline(false);

      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(false),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token: sessionToken,
          domain: publicDirectLine,
        }),
      ).to.be.true;
    });
    it('should not include conversationId on first connection when using local mock if persistence is disabled', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorageBase();
      stubUseLocalDirectline(true);

      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(false),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token: sessionToken,
          domain: localDirectLine,
        }),
      ).to.be.true;
    });
    it('should set watermark when persistence is enabled for the local mock', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorageBase();
      stubUseLocalDirectline(true);
      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(true),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token: sessionToken,
          domain: localDirectLine,
          conversationId: sessionConversationIdKey,
          watermark: '0',
        }),
      ).to.be.true;
    });

    it('should fallback to a fresh connection when initial reconnect fails using the local mock', () => {
      // First instance simulates a failed reconnect via connectionStatus$ = 4
      let subscriber;
      const firstInstance = {
        connectionStatus$: {
          subscribe: fn => {
            subscriber = fn;
            return { unsubscribe() {} };
          },
        },
      };
      const secondInstance = {}; // fresh

      const createDirectLineFn = sandbox.stub();
      setSessionStorageBase();
      stubUseLocalDirectline(true);

      createDirectLineFn.onCall(0).returns(firstInstance);
      createDirectLineFn.onCall(1).returns(secondInstance);

      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(true),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token: sessionToken,
          domain: localDirectLine,
          conversationId: sessionConversationIdKey,
          watermark: '0',
        }),
      ).to.be.true;

      act(() => subscriber(4));

      expect(createDirectLineFn.calledTwice).to.be.true;
      expect(
        createDirectLineFn.secondCall.calledWithExactly({
          token: sessionToken,
          domain: localDirectLine,
        }),
      ).to.be.true;
    });
  });
});
