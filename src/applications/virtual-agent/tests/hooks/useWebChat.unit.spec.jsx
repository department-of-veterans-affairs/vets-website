import sinon from 'sinon';
import { expect } from 'chai';

import * as WebChatFrameworkModule from '../../utils/webChatFrameworkBase';
import * as useChatbotTokenModule from '../../hooks/useChatbotToken';
import * as CombineLoadingStatusModule from '../../utils/loadingStatus';
import useWebChat from '../../hooks/useWebChat';

describe('useWebChat', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox(); // Note: use createSandbox() not sandbox.create()
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('useWebChat', () => {
    it('should return the correct token, webChatFramework and loadingStatus', () => {
      const token = {
        token: 'token',
        code: 'code',
        loadingStatus: CombineLoadingStatusModule.COMPLETE,
      };
      sandbox.stub(useChatbotTokenModule, 'default').returns(token);

      const result = useWebChat(
        { virtualAgentEnableParamErrorDetection: false },
        CombineLoadingStatusModule.COMPLETE,
      );

      expect(result).to.deep.equal({
        token: 'token',
        code: 'code',
        webChatFramework: WebChatFrameworkModule.default,
        loadingStatus: CombineLoadingStatusModule.COMPLETE,
      });
    });

    it('should not call combineLoadingStatus when virtualAgentEnableParamErrorDetection is false', () => {
      const token = {
        token: 'token',
        loadingStatus: CombineLoadingStatusModule.COMPLETE,
      };
      sandbox.stub(useChatbotTokenModule, 'default').returns(token);

      const combineLoadingStatusStub = sandbox
        .stub(CombineLoadingStatusModule, 'combineLoadingStatus')
        .returns(CombineLoadingStatusModule.COMPLETE);

      const virtualAgentEnableParamErrorDetection = false;
      const result = useWebChat(
        virtualAgentEnableParamErrorDetection,
        CombineLoadingStatusModule.COMPLETE,
      );

      expect(combineLoadingStatusStub.called).to.equal(false);
      expect(result.loadingStatus).to.equal(
        CombineLoadingStatusModule.COMPLETE,
      );
    });

    it('should call combineLoadingStatus when virtualAgentEnableParamErrorDetection is true', () => {
      const token = {
        token: 'token',
        loadingStatus: CombineLoadingStatusModule.COMPLETE,
      };
      sandbox.stub(useChatbotTokenModule, 'default').returns(token);

      const combineLoadingStatusStub = sandbox
        .stub(CombineLoadingStatusModule, 'combineLoadingStatus')
        .returns(CombineLoadingStatusModule.COMPLETE);

      const result = useWebChat(true, CombineLoadingStatusModule.COMPLETE);

      expect(combineLoadingStatusStub.calledOnce).to.equal(true);
      expect(result.loadingStatus).to.equal(
        CombineLoadingStatusModule.COMPLETE,
      );
    });
  });
});
