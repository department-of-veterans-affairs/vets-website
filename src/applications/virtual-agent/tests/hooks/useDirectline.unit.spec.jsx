import React from 'react';
import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import TOGGLE_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import * as SessionStorageModule from '../../utils/sessionStorage';
import useDirectLine from '../../hooks/useDirectline';

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
      expect(createDirectLineFn.args[0][0].conversationId).to.equal(
        sessionConversationIdKey,
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
      expect(createDirectLineFn.args[0][0].conversationId).to.equal(
        sessionConversationIdKey,
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
      expect(createDirectLineFn.args[0][0].conversationId).to.equal(
        sessionConversationIdKey,
      );
    });
    it('should include conversationId when present (production)', () => {
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
          conversationId: sessionConversationIdKey,
        }),
      ).to.be.true;
    });
    it('should include conversationId on subsequent connections', () => {
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
          conversationId: sessionConversationIdKey,
        }),
      ).to.be.true;
    });
    it('should include conversationId on first connection when using local mock', () => {
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
          conversationId: sessionConversationIdKey,
        }),
      ).to.be.true;
    });
    it('should set watermark when persistence is enabled', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorageBase();
      stubUseLocalDirectline(false);
      renderHook(() => useDirectLine(createDirectLineFn), {
        wrapper: createWrapper(true),
      });

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token: sessionToken,
          domain: publicDirectLine,
          conversationId: sessionConversationIdKey,
          watermark: '0',
        }),
      ).to.be.true;
    });
  });
});
