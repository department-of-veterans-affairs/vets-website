import sinon from 'sinon';
import { expect } from 'chai';

import * as useChatbotTokenModule from '../../hooks/useChatbotToken';
import * as UseWebChatFrameworkModule from '../../hooks/useWebChatFramework';
import * as CombingLoadingStatusModule from '../../utils/loadingStatus';
import useWebChat from '../../hooks/useWebChat';

describe('useWebChat', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useWebChat', () => {
    it('should return the correct token, webChatFramework and loadingStatus', () => {
      const webChatFramework = {
        webChatFramework: 'framework',
        loadingStatus: 'frameworkStatus',
      };
      sandbox
        .stub(UseWebChatFrameworkModule, 'default')
        .returns(webChatFramework);

      const token = { token: 'token', code: 'code' };
      sandbox.stub(useChatbotTokenModule, 'default').returns(token);

      sandbox
        .stub(CombingLoadingStatusModule, 'combineLoadingStatus')
        .returns('combinedStatus');

      const result = useWebChat(
        { virtualAgentEnableParamErrorDetection: false },
        'paramStatus',
      );

      expect(result).to.deep.equal({
        ...token,
        webChatFramework: 'framework',
        loadingStatus: 'combinedStatus',
      });
    });
    it('should call combineLoadingStatus once when virtualAgentEnableParamErrorDetection is false', () => {
      const webChatFramework = {
        webChatFramework: 'framework',
        loadingStatus: 'frameworkStatus',
      };
      sandbox
        .stub(UseWebChatFrameworkModule, 'default')
        .returns(webChatFramework);

      const token = { token: 'token' };
      sandbox.stub(useChatbotTokenModule, 'default').returns(token);

      const combineLoadingStatusStub = sandbox
        .stub(CombingLoadingStatusModule, 'combineLoadingStatus')
        .returns('combinedStatus');

      useWebChat(
        { virtualAgentEnableParamErrorDetection: false },
        'paramStatus',
      );

      expect(combineLoadingStatusStub.calledOnce).to.be.true;
    });
    it('should call combineLoadingStatus when virtualAgentEnableParamErrorDetection is true', () => {
      const webChatFramework = {
        webChatFramework: 'framework',
        loadingStatus: 'frameworkStatus',
      };
      sandbox
        .stub(UseWebChatFrameworkModule, 'default')
        .returns(webChatFramework);

      const token = { token: 'token' };
      sandbox.stub(useChatbotTokenModule, 'default').returns(token);

      const combineLoadingStatusStub = sandbox
        .stub(CombingLoadingStatusModule, 'combineLoadingStatus')
        .returns('combinedStatus');

      useWebChat(
        { virtualAgentEnableParamErrorDetection: true },
        'paramStatus',
      );

      expect(combineLoadingStatusStub.calledTwice).to.be.true;
    });
  });
});
