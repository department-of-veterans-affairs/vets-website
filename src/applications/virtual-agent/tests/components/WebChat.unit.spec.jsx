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

// Event Listeners
import * as SignOutEventListenerModule from '../../event-listeners/signOutEventListener';
import * as ClearBotSessionStorageEventListenerModule from '../../event-listeners/clearBotSessionStorageEventListener';

// Selectors
import * as SelectAccountUuidModule from '../../selectors/selectAccountUuid';
import * as SelectUserCurrentlyLoggedInModule from '../../selectors/selectUserCurrentlyLoggedIn';
import * as SelectUserFirstNameModule from '../../selectors/selectUserFirstName';

// Hooks
import * as UseBotPonyfillModule from '../../hooks/useBotPonyfill';
import * as UseDirectLineModule from '../../hooks/useDirectline';
import * as UseRxSkillEventListenerModule from '../../hooks/useRxSkillEventListener';
import * as UseSetSendBoxMessageModule from '../../hooks/useSetSendBoxMessage';
import * as UseWebChatStoreModule from '../../hooks/useWebChatStore';

// Middleware
import * as CardActionMiddlewareModule from '../../middleware/cardActionMiddleware';
import * as ActivityMiddlewareModule from '../../middleware/activityMiddleware';

// Utils and Helpers
import * as SessionStorageModule from '../../utils/sessionStorage';
import * as ValidateParametersModule from '../../utils/validateParameters';
import * as TelemetryModule from '../../utils/telemetry';
import MarkdownRenderer from '../../utils/markdownRenderer';

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

    const getWebChatFramework = () => {
      return {
        createDirectLine: sinon.spy(),
        createStore: sandbox.spy(),
        Components: {
          BasicWebChat: sinon
            .stub()
            .callsFake(props => <div data-testid="BasicWebChat" {...props} />),
          Composer: sinon
            .stub()
            .callsFake(props => <div data-testid="Composer" {...props} />),
        },
      };
    };

    const stubFunctions = () => {
      return {
        validateParametersStub: sandbox.stub(
          ValidateParametersModule,
          'default',
        ),
        useWebChatStoreStub: sandbox
          .stub(UseWebChatStoreModule, 'default')
          .returns('fake-webchat-store'),
        clearBotSessionStorageEventListenerStub: sandbox.stub(
          ClearBotSessionStorageEventListenerModule,
          'default',
        ),
        signOutEventListenerStub: sandbox.stub(
          SignOutEventListenerModule,
          'default',
        ),
        useBotPonyFillStub: sandbox.stub(UseBotPonyfillModule, 'default'),
        rxSkillEventListenerStub: sandbox.stub(
          UseRxSkillEventListenerModule,
          'default',
        ),
        useSetSendBoxMessageStub: sandbox.stub(
          UseSetSendBoxMessageModule,
          'default',
        ),
        useDirectlineStub: sandbox
          .stub(UseDirectLineModule, 'default')
          .returns('fake-directline'),
      };
    };

    it('should validate parameters, setup event listeners, setup useEffects and render', () => {
      const webChatFramework = getWebChatFramework();
      const setParamLoadingStatus = sandbox.spy();

      stubValues();
      const functionStubs = stubFunctions();

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

      expect(functionStubs.validateParametersStub.calledOnce).to.be.true;
      expect(functionStubs.useWebChatStoreStub.calledOnce).to.be.true;
      expect(functionStubs.clearBotSessionStorageEventListenerStub.calledOnce)
        .to.be.true;
      expect(functionStubs.signOutEventListenerStub.calledOnce).to.be.true;
      expect(functionStubs.useBotPonyFillStub.calledOnce).to.be.true;
      expect(functionStubs.rxSkillEventListenerStub.calledOnce).to.be.true;
      expect(functionStubs.useSetSendBoxMessageStub.calledOnce).to.be.true;
      expect(functionStubs.useDirectlineStub.calledOnce).to.be.true;
    });
    it('should call rx skill effects a second time when rxSkill event is triggered', async () => {
      const webChatFramework = getWebChatFramework();
      const setParamLoadingStatus = sandbox.spy();

      stubValues();
      const functionStubs = stubFunctions();

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

      expect(functionStubs.rxSkillEventListenerStub.calledOnce).to.be.true;
      expect(functionStubs.useSetSendBoxMessageStub.calledOnce).to.be.true;
    });
    it('should render Composer with args and BasicWebChat', () => {
      const webChatFramework = {
        createDirectLine: sinon.spy(),
        createStore: sandbox.spy(),
        Components: {
          BasicWebChat: sinon
            .stub()
            .callsFake(props => <div data-testid="BasicWebChat" {...props} />),
          Composer: sinon
            .stub()
            .callsFake(props => <div data-testid="Composer" {...props} />),
        },
      };
      const setParamLoadingStatus = sandbox.spy();

      stubValues();
      stubFunctions();
      const cardActionMiddlewareStub = sandbox.stub(
        CardActionMiddlewareModule,
        'cardActionMiddleware',
      );
      const activityMiddlewareStub = sandbox.stub(
        ActivityMiddlewareModule,
        'activityMiddleware',
      );
      const handleTelemetryStub = sandbox.stub(TelemetryModule, 'default');
      // const renderMarkdownStub = sandbox.stub(WebChat, 'renderMarkdown');
      const store = mockStore({});

      const { getByTestId } = render(
        <Provider store={store}>
          <WebChat
            token={token}
            webChatFramework={webChatFramework}
            apiSession={apiSession}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );

      expect(getByTestId('Composer')).to.exist;
      expect(getByTestId('BasicWebChat')).to.exist;
      expect(
        webChatFramework.Components.Composer.getCall(0).args[0]
          .cardActionMiddleware,
      ).to.equal(cardActionMiddlewareStub);
      expect(
        webChatFramework.Components.Composer.getCall(0).args[0]
          .activityMiddleware,
      ).to.equal(activityMiddlewareStub);
      expect(
        webChatFramework.Components.Composer.getCall(0).args[0].styleOptions,
      ).to.not.be.undefined;
      expect(
        webChatFramework.Components.Composer.getCall(0).args[0].directLine,
      ).to.equal('fake-directline');
      expect(
        webChatFramework.Components.Composer.getCall(0).args[0].store,
      ).to.equal('fake-webchat-store');
      expect(
        webChatFramework.Components.Composer.getCall(0).args[0].renderMarkdown,
      ).to.equal(renderMarkdown);
      expect(
        webChatFramework.Components.Composer.getCall(0).args[0].onTelemetry,
      ).to.equal(handleTelemetryStub);
    });
    it('should render without webSpeechPonyfillFactory when not in rx skill', () => {
      const webChatFramework = getWebChatFramework();
      const setParamLoadingStatus = sandbox.spy();

      stubValues();

      const { getByTestId } = render(
        <Provider store={mockStore({})}>
          <WebChat
            token={token}
            webChatFramework={webChatFramework}
            apiSession={apiSession}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );

      const lastCallIndex =
        webChatFramework.Components.Composer.args.length - 1;
      expect(getByTestId('Composer')).to.exist;
      expect(
        webChatFramework.Components.Composer.getCall(lastCallIndex).args[0]
          .webSpeechPonyfillFactory,
      ).to.be.undefined;
    });
    it('should render with webSpeechPonyfillFactory when in rx skill', async () => {
      // we should find a better way to do this since we shouldn't know about these in this functio
      global.window.WebChat = {
        createCognitiveServicesSpeechServicesPonyfillFactory: sandbox
          .stub()
          .resolves(true),
      };
      sandbox.stub(ApiModule, ApiModule.apiRequest.name).resolves({});

      const webChatFramework = getWebChatFramework();
      const setParamLoadingStatus = sandbox.spy();

      stubValues();
      sandbox.stub(SessionStorageModule, 'getIsRxSkill').returns('true');

      const { getByTestId } = render(
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

      const lastCallIndex =
        webChatFramework.Components.Composer.args.length - 1;
      expect(getByTestId('Composer')).to.exist;
      expect(
        webChatFramework.Components.Composer.getCall(lastCallIndex).args[0]
          .webSpeechPonyfillFactory,
      ).to.not.be.undefined;
    });
  });
});
