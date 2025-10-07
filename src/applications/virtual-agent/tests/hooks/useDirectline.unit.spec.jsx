import { expect } from 'chai';
import { renderHook } from '@testing-library/react-hooks';
import sinon from 'sinon';
import useDirectLine from '../../hooks/useDirectline';
import * as SessionStorageModule from '../../utils/sessionStorage';

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
      USE_LOCAL_DIRECTLINE: useLocalDirectline,
    });
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
      sandbox
        .stub(
          SessionStorageModule,
          SessionStorageModule.getFirstConnection.name,
        )
        .returns(undefined);

      renderHook(() => useDirectLine(createDirectLineFn));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(localDirectLine);
    });
    it('should call public directline when USE_LOCAL_DIRECTLINE is false', () => {
      const createDirectLineFn = sandbox.spy();
      stubUseLocalDirectline(false);
      setSessionStorageBase();
      sandbox
        .stub(
          SessionStorageModule,
          SessionStorageModule.getFirstConnection.name,
        )
        .returns(undefined);

      renderHook(() => useDirectLine(createDirectLineFn));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(publicDirectLine);
    });
    it('should call public directline when USE_LOCAL_DIRECTLINE is not set', () => {
      const createDirectLineFn = sandbox.spy();
      stubUseLocalDirectline('');
      setSessionStorageBase();
      sandbox
        .stub(
          SessionStorageModule,
          SessionStorageModule.getFirstConnection.name,
        )
        .returns(undefined);

      renderHook(() => useDirectLine(createDirectLineFn));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(createDirectLineFn.args[0][0].domain).to.equal(publicDirectLine);
    });
    it('should omit conversationId on first connection (production)', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorageBase();
      stubUseLocalDirectline(false);
      sandbox
        .stub(
          SessionStorageModule,
          SessionStorageModule.getFirstConnection.name,
        )
        .returns(undefined);

      renderHook(() => useDirectLine(createDirectLineFn));

      expect(createDirectLineFn.calledOnce).to.be.true;
      expect(
        createDirectLineFn.calledWithExactly({
          token: sessionToken,
          domain: publicDirectLine,
          conversationId: '',
          watermark: '0',
        }),
      ).to.be.true;
    });
    it('should include conversationId on subsequent connections', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorageBase();
      stubUseLocalDirectline(false);
      sandbox
        .stub(
          SessionStorageModule,
          SessionStorageModule.getFirstConnection.name,
        )
        .returns('false');

      renderHook(() => useDirectLine(createDirectLineFn));

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
    it('should include conversationId on first connection when using local mock', () => {
      const createDirectLineFn = sandbox.spy();
      setSessionStorageBase();
      stubUseLocalDirectline(true);
      sandbox
        .stub(
          SessionStorageModule,
          SessionStorageModule.getFirstConnection.name,
        )
        .returns(undefined);

      renderHook(() => useDirectLine(createDirectLineFn));

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
    it("should set firstConnection to 'false' after hook runs", () => {
      const createDirectLineFn = sandbox.spy();
      const setFirstConnectionSpy = sandbox.spy(
        SessionStorageModule,
        SessionStorageModule.setFirstConnection.name,
      );
      setSessionStorageBase();
      stubUseLocalDirectline(false);
      sandbox
        .stub(
          SessionStorageModule,
          SessionStorageModule.getFirstConnection.name,
        )
        .returns(undefined);

      renderHook(() => useDirectLine(createDirectLineFn));

      expect(setFirstConnectionSpy.calledOnce).to.be.true;
      expect(setFirstConnectionSpy.calledWith('false')).to.be.true;
    });
  });
});
