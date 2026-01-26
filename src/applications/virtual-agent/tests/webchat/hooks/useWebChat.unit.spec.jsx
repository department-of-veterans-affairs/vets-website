import { expect } from 'chai';
import sinon from 'sinon';

import * as useChatbotTokenModule from '../../../webchat/hooks/useChatbotToken';
import useWebChat from '../../../webchat/hooks/useWebChat';
import * as LoadingStatusModule from '../../../webchat/utils/loadingStatus';
import * as WebChatFrameworkModule from '../../../webchat/utils/webChatFrameworkBase';

describe('useWebChat', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useWebChat', () => {
    it('returns token, framework, and combined loadingStatus when feature flag is true', () => {
      const webChatFramework = { some: 'framework' };
      sandbox.stub(WebChatFrameworkModule, 'default').value(webChatFramework);

      const chatbotToken = {
        token: 'token',
        code: 'code',
        expired: undefined,
        loadingStatus: 'tokenStatus',
      };
      sandbox.stub(useChatbotTokenModule, 'default').returns(chatbotToken);

      const combineStub = sandbox
        .stub(LoadingStatusModule, 'combineLoadingStatus')
        .returns('combinedStatus');

      const result = useWebChat(true, 'paramStatus');

      expect(combineStub.calledOnce).to.be.true;
      expect(combineStub.calledWithExactly('tokenStatus', 'paramStatus')).to.be
        .true;

      expect(result).to.deep.equal({
        token: 'token',
        code: 'code',
        expired: undefined,
        webChatFramework,
        loadingStatus: 'combinedStatus',
      });
    });

    it('uses token loadingStatus directly when feature flag is false', () => {
      const chatbotToken = {
        token: 'token',
        code: 'code',
        expired: false,
        loadingStatus: 'tokenStatus',
      };
      sandbox.stub(useChatbotTokenModule, 'default').returns(chatbotToken);

      const combineStub = sandbox.stub(
        LoadingStatusModule,
        'combineLoadingStatus',
      );

      const result = useWebChat(false, 'paramStatus');

      expect(combineStub.called).to.be.false;
      expect(result.loadingStatus).to.equal('tokenStatus');
    });

    it('calls combineLoadingStatus when feature flag is true', () => {
      const chatbotToken = {
        token: 'token',
        code: undefined,
        expired: false,
        loadingStatus: 'tokenStatus',
      };
      sandbox.stub(useChatbotTokenModule, 'default').returns(chatbotToken);

      const combineStub = sandbox
        .stub(LoadingStatusModule, 'combineLoadingStatus')
        .returns('combinedStatus');

      const result = useWebChat(true, 'paramStatus');

      expect(combineStub.calledOnce).to.be.true;
      expect(result.loadingStatus).to.equal('combinedStatus');
    });
  });
});
