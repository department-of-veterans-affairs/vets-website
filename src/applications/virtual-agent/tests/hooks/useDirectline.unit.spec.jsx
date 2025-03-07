import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import useDirectLine from '../../hooks/useDirectline';
import * as SessionStorageModule from '../../utils/sessionStorage';

const publicDirectLine =
  'https://northamerica.directline.botframework.com/v3/directline';
const localDirectLine = 'http://localhost:3002/v3/directline';
const token = 'fake-token';
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
      USE_LOCAL_DIRECTLINE: useLocalDirectline,
    });
  };

  const setSessionStorage = loggedIn => {
    sandbox
      .stub(SessionStorageModule, SessionStorageModule.getTokenKey.name)
      .returns(sessionToken);

    sandbox
      .stub(
        SessionStorageModule,
        SessionStorageModule.getConversationIdKey.name,
      )
      .returns(sessionConversationIdKey);

    sandbox
      .stub(SessionStorageModule, SessionStorageModule.getLoggedInFlow.name)
      .returns(loggedIn);
  };

  describe('useDirectLine', () => {
    it('should call local directline when USE_LOCAL_DIRECTLINE is true', () => {
      const createDirectLineFn = sandbox.spy();
      stubUseLocalDirectline(true);

      renderHook(() => useDirectLine(createDirectLineFn, token, false));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(localDirectLine);
    });
    it('should call public directline when USE_LOCAL_DIRECTLINE is false', () => {
      const createDirectLineFn = sandbox.spy();
      stubUseLocalDirectline(false);

      renderHook(() => useDirectLine(createDirectLineFn, token, false));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(publicDirectLine);
    });
    it('should call public directline when USE_LOCAL_DIRECTLINE is not set', () => {
      const createDirectLineFn = sandbox.spy();
      stubUseLocalDirectline('');

      renderHook(() => useDirectLine(createDirectLineFn, token, false));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(publicDirectLine);
    });
    it('should use default values when logged out', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorage('false');

      renderHook(() => useDirectLine(createDirectLineFn, token, false));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token,
          domain: publicDirectLine,
          conversationId: '',
          watermark: '',
        }),
      ).to.be.true;
    });
    it('should use session storage values when logged in', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorage('true');

      renderHook(() => useDirectLine(createDirectLineFn, token, true));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token: sessionToken,
          domain: publicDirectLine,
          conversationId: sessionConversationIdKey,
          watermark: '',
        }),
      ).to.be.true;
    });
  });
});
