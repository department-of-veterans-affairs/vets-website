import sinon from 'sinon';
import { expect } from 'chai';
import { describe } from 'mocha';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';

import * as ApiModule from '@department-of-veterans-affairs/platform-utilities/api';

import useBotPonyFill from '../../hooks/useBotPonyfill';

describe('useBotPonyfill', () => {
  let sandbox;
  const originalWindow = global.window;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    global.window = originalWindow;
  });

  describe('createPonyFill', () => {
    it('should create a ponyfill factory with the correct credentials on locahost', async () => {
      const createCognitiveServicesSpeechServicesPonyfillFactoryStub = sandbox
        .stub()
        .resolves(true);
      global.window.WebChat = {
        createCognitiveServicesSpeechServicesPonyfillFactory: createCognitiveServicesSpeechServicesPonyfillFactoryStub,
      };

      const setBotPonyfillStub = sandbox.stub();
      const environment = {
        isDev: sandbox.stub().returns(false),
        isLocalhost: sandbox.stub().returns(true),
      };

      const speechToken = { token: 'fakeToken' };
      const apiRequestStub = sandbox
        .stub(ApiModule, ApiModule.apiRequest.name)
        .resolves(speechToken);

      await act(async () => {
        renderHook(() => useBotPonyFill(setBotPonyfillStub, environment));
      });

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(
        apiRequestStub.calledWith('/virtual_agent_speech_token', {
          method: 'POST',
        }),
      ).to.be.true;
      expect(
        createCognitiveServicesSpeechServicesPonyfillFactoryStub.calledWith({
          credentials: {
            region: 'eastus',
            authorizationToken: speechToken.token,
          },
        }),
      ).to.be.true;
      expect(setBotPonyfillStub.calledOnce).to.be.true;
    });
    it('should create a ponyfill factory with the correct credentials on dev', async () => {
      const createCognitiveServicesSpeechServicesPonyfillFactoryStub = sandbox
        .stub()
        .resolves(true);
      global.window.WebChat = {
        createCognitiveServicesSpeechServicesPonyfillFactory: createCognitiveServicesSpeechServicesPonyfillFactoryStub,
      };

      const setBotPonyfillStub = sandbox.stub().returns(true);
      const environment = {
        isDev: sandbox.stub().returns(true),
        isLocalhost: sandbox.stub().returns(false),
      };

      const speechToken = { token: 'fakeToken' };
      const apiRequestStub = sandbox
        .stub(ApiModule, ApiModule.apiRequest.name)
        .resolves(speechToken);

      await act(async () => {
        renderHook(() => useBotPonyFill(setBotPonyfillStub, environment));
      });

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(
        apiRequestStub.calledWith('/virtual_agent_speech_token', {
          method: 'POST',
        }),
      ).to.be.true;
      expect(
        createCognitiveServicesSpeechServicesPonyfillFactoryStub.calledWith({
          credentials: {
            region: 'eastus',
            authorizationToken: speechToken.token,
          },
        }),
      ).to.be.true;
      expect(setBotPonyfillStub.calledOnce).to.be.true;
    });
    it('should create a ponyfill factory with the correct credentials on non-dev/non-staging', async () => {
      const createCognitiveServicesSpeechServicesPonyfillFactoryStub = sandbox
        .stub()
        .resolves(true);
      global.window.WebChat = {
        createCognitiveServicesSpeechServicesPonyfillFactory: createCognitiveServicesSpeechServicesPonyfillFactoryStub,
      };

      const setBotPonyfillStub = sandbox.stub();
      const environment = {
        isDev: sandbox.stub().returns(false),
        isLocalhost: sandbox.stub().returns(false),
      };

      const speechToken = { token: 'fakeToken' };
      const apiRequestStub = sandbox
        .stub(ApiModule, ApiModule.apiRequest.name)
        .resolves(speechToken);

      await act(async () => {
        renderHook(() => useBotPonyFill(setBotPonyfillStub, environment));
      });

      expect(apiRequestStub.calledOnce).to.be.true;
      expect(
        apiRequestStub.calledWith('/virtual_agent_speech_token', {
          method: 'POST',
        }),
      ).to.be.true;
      expect(
        createCognitiveServicesSpeechServicesPonyfillFactoryStub.calledWith({
          credentials: {
            region: 'eastus2',
            authorizationToken: speechToken.token,
          },
        }),
      ).to.be.true;
      expect(setBotPonyfillStub.calledOnce).to.be.true;
    });
  });
});
