import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as ApiModule from '@department-of-veterans-affairs/platform-utilities/api';
import WebChat, { renderMarkdown } from '../../components/WebChat';
import MarkdownRenderer from '../../utils/markdownRenderer';

// Event Listeners
import * as signOutEventListenerModule from '../../event-listeners/signOutEventListener';
import * as ClearBotSessionStorageEventListenerModule from '../../event-listeners/clearBotSessionStorageEventListener';

// Selectors
import * as SelectAccountUuidModule from '../../selectors/selectAccountUuid';
import * as SelectUserCurrentlyLoggedInModule from '../../selectors/selectUserCurrentlyLoggedIn';
import * as SelectUserFirstNameModule from '../../selectors/selectUserFirstName';

// Hooks
import * as UseBotPonyfillModule from '../../hooks/useBotPonyfill';
import * as UseDirectLineModule from '../../hooks/useDirectline';
import * as UseRecordRxSessionModule from '../../hooks/useRecordRxSession';
import * as UseRxSkillEventListenerModule from '../../hooks/useRxSkillEventListener';
import * as UseSetSendBoxMessageModule from '../../hooks/useSetSendBoxMessage';
import * as UseWebChatStoreModule from '../../hooks/useWebChatStore';

// Utils and Helpers
import * as SessionStorageModule from '../../utils/sessionStorage';
import * as ValidateParametersModule from '../../utils/validateParameters';

describe('WebChat', () => {
  let sandbox;
  const originalWindow = global.window;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    global.window = originalWindow;
  });

  const middleware = [thunk];
  const mockStore = configureStore(middleware);

  describe('renderMarkdown', () => {
    it('should render markdown', () => {
      const renderSpy = sandbox.spy(MarkdownRenderer, 'render');

      const markdown = 'This is a test';
      renderMarkdown(markdown);

      expect(renderSpy.calledOnce).to.be.true;
      expect(renderSpy.calledWith(markdown)).to.be.true;
    });
  });
  describe('WebChat', () => {
    const token = 'fake-token';
    const apiSession = 'fake-api-session';

    const stubValues = () => {
      localStorage.setItem('csrfToken', 'fake-csrf-token');
      sandbox.stub(SelectUserFirstNameModule, 'default').returns('fake-name');
      sandbox
        .stub(SelectAccountUuidModule, 'default')
        .returns('fake-user-uuid');
      sandbox.stub(SelectUserCurrentlyLoggedInModule, 'default').returns(true);
    };

    it('should validate parameters, setup event listeners, setup useEffects and render', () => {
      const webChatFramework = {
        ReactWebChat: sandbox.stub().returns(<div />),
        createDirectline: sandbox.spy(),
        createStore: sandbox.spy(),
      };
      const setParamLoadingStatus = sandbox.spy();

      stubValues();

      const validateParametersStub = sandbox.stub(
        ValidateParametersModule,
        'default',
      );
      const useWebChatStoreStub = sandbox.stub(
        UseWebChatStoreModule,
        'default',
      );
      const clearBotSessionStorageEventListenerStub = sandbox.stub(
        ClearBotSessionStorageEventListenerModule,
        'default',
      );
      const signOutEventListenerStub = sandbox.stub(
        signOutEventListenerModule,
        'default',
      );
      const useBotPonyFillStub = sandbox.stub(UseBotPonyfillModule, 'default');
      const rxSkillEventListenerStub = sandbox.stub(
        UseRxSkillEventListenerModule,
        'default',
      );
      const useSetSendBoxMessageStub = sandbox.stub(
        UseSetSendBoxMessageModule,
        'default',
      );
      const useRecordRxSessionStub = sandbox.stub(
        UseRecordRxSessionModule,
        'default',
      );
      const useDirectlineStub = sandbox.stub(UseDirectLineModule, 'default');

      render(
        <Provider store={mockStore({})}>
          <WebChat
            token={token}
            webChatFramework={webChatFramework}
            apiSession={apiSession}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );

      expect(validateParametersStub.calledOnce).to.be.true;
      expect(useWebChatStoreStub.calledOnce).to.be.true;
      expect(clearBotSessionStorageEventListenerStub.calledOnce).to.be.true;
      expect(signOutEventListenerStub.calledOnce).to.be.true;
      expect(useBotPonyFillStub.calledOnce).to.be.true;
      expect(rxSkillEventListenerStub.calledOnce).to.be.true;
      expect(useSetSendBoxMessageStub.calledOnce).to.be.true;
      expect(useRecordRxSessionStub.calledOnce).to.be.true;
      expect(useDirectlineStub.calledOnce).to.be.true;
    });
    it('should call rx skill effects a second time when rxSkill event is triggered', async () => {
      const webChatFramework = {
        ReactWebChat: sandbox.stub().returns(<div />),
        createDirectline: sandbox.spy(),
        createStore: sandbox.spy(),
      };
      const setParamLoadingStatus = sandbox.spy();

      stubValues();

      const rxSkillEventListenerStub = sandbox.stub(
        UseRxSkillEventListenerModule,
        'default',
      );
      const useSetSendBoxMessageStub = sandbox.stub(
        UseSetSendBoxMessageModule,
        'default',
      );
      const useRecordRxSessionStub = sandbox.stub(
        UseRecordRxSessionModule,
        'default',
      );

      sandbox.stub(ValidateParametersModule, 'default');
      sandbox.stub(UseWebChatStoreModule, 'default');
      sandbox.stub(ClearBotSessionStorageEventListenerModule, 'default');
      sandbox.stub(signOutEventListenerModule, 'default');
      sandbox.stub(UseBotPonyfillModule, 'default');
      sandbox.stub(UseDirectLineModule, 'default');

      render(
        <Provider store={mockStore({})}>
          <WebChat
            token={token}
            webChatFramework={webChatFramework}
            apiSession={apiSession}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );

      expect(rxSkillEventListenerStub.calledOnce).to.be.true;
      expect(useSetSendBoxMessageStub.calledOnce).to.be.true;
      expect(useRecordRxSessionStub.calledOnce).to.be.true;
    });
    it('should render without webSpeechPonyfillFactory when not in rx skill', () => {
      const reactWebChatStub = sandbox.stub().returns(<div />);
      const webChatFramework = {
        ReactWebChat: reactWebChatStub,
        createDirectline: sandbox.spy(),
        createStore: sandbox.spy(),
      };
      const setParamLoadingStatus = sandbox.spy();

      stubValues();
      sandbox.stub(ValidateParametersModule, 'default');
      sandbox.stub(UseWebChatStoreModule, 'default');
      sandbox.stub(ClearBotSessionStorageEventListenerModule, 'default');
      sandbox.stub(signOutEventListenerModule, 'default');
      sandbox.stub(UseBotPonyfillModule, 'default');
      sandbox.stub(UseRxSkillEventListenerModule, 'default');
      sandbox.stub(UseSetSendBoxMessageModule, 'default');
      sandbox.stub(UseRecordRxSessionModule, 'default');
      sandbox.stub(UseDirectLineModule, 'default');

      render(
        <Provider store={mockStore({})}>
          <WebChat
            token={token}
            webChatFramework={webChatFramework}
            apiSession={apiSession}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );

      expect(reactWebChatStub.calledOnce).to.be.true;
      expect(reactWebChatStub.getCall(0).args[0].webSpeechPonyfillFactory).to.be
        .undefined;
    });
    it('should render with webSpeechPonyfillFactory when in rx skill', async () => {
      // we should find a better way to do this since we shouldn't know about these in this functio
      global.window.WebChat = {
        createCognitiveServicesSpeechServicesPonyfillFactory: sandbox
          .stub()
          .resolves(true),
      };
      sandbox.stub(ApiModule, ApiModule.apiRequest.name).resolves({});

      const reactWebChatStub = sandbox.stub().returns(<div />);
      const webChatFramework = {
        ReactWebChat: reactWebChatStub,
        createDirectline: sandbox.spy(),
        createStore: sandbox.spy(),
      };
      const setParamLoadingStatus = sandbox.spy();

      stubValues();
      sandbox.stub(ValidateParametersModule, 'default');
      sandbox.stub(UseWebChatStoreModule, 'default');
      sandbox.stub(ClearBotSessionStorageEventListenerModule, 'default');
      sandbox.stub(signOutEventListenerModule, 'default');
      sandbox.stub(UseSetSendBoxMessageModule, 'default');
      sandbox.stub(UseRecordRxSessionModule, 'default');
      sandbox.stub(UseDirectLineModule, 'default');
      sandbox.stub(SessionStorageModule, 'getIsRxSkill').returns('true');

      render(
        <Provider store={mockStore({})}>
          <WebChat
            token={token}
            webChatFramework={webChatFramework}
            apiSession={apiSession}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );

      await act(async () => {
        global.window.dispatchEvent(new Event('rxSkill'));
      });

      expect(reactWebChatStub.calledThrice).to.be.true;
      expect(reactWebChatStub.getCall(2).args[0].webSpeechPonyfillFactory).to
        .not.be.undefined;
    });
  });
});
