import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as FeatureToggleModule from 'platform/utilities/feature-toggles';
import * as FeatureToggleHooks from 'platform/utilities/feature-toggles/useFeatureToggle';
import * as WebChatModule from '../../components/WebChat';

const WebChat = WebChatModule.default;
const { renderMarkdown } = WebChatModule;

// Event Listeners
import * as SignOutEventListenerModule from '../../event-listeners/signOutEventListener';
import * as ClearBotSessionStorageEventListenerModule from '../../event-listeners/clearBotSessionStorageEventListener';

// Selectors
import * as SelectAccountUuidModule from '../../selectors/selectAccountUuid';
import * as SelectUserCurrentlyLoggedInModule from '../../selectors/selectUserCurrentlyLoggedIn';
import * as SelectUserFirstNameModule from '../../selectors/selectUserFirstName';

// Hooks
import * as UseDirectLineModule from '../../hooks/useDirectline';
import * as UseWebChatStoreModule from '../../hooks/useWebChatStore';

// Middleware
import * as CardActionMiddlewareModule from '../../middleware/cardActionMiddleware';
import * as ActivityMiddlewareModule from '../../middleware/activityMiddleware';

// Utils and Helpers
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

    const stubValues = () => {
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
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );

      expect(functionStubs.useWebChatStoreStub.calledOnce).to.be.true;
      expect(functionStubs.clearBotSessionStorageEventListenerStub.calledOnce)
        .to.be.true;
      expect(functionStubs.signOutEventListenerStub.calledOnce).to.be.true;
      expect(functionStubs.useDirectlineStub.calledOnce).to.be.true;
    });

    it('should render Composer with args and BasicWebChat and set activityStatusMiddleware if isAIDisclaimerEnabled is true', () => {
      sandbox.stub(FeatureToggleHooks, 'useFeatureToggle').returns({
        TOGGLE_NAMES: {
          virtualAgentShowAiDisclaimer: 'virtualAgentShowAiDisclaimer',
          virtualAgentComponentTesting: 'virtualAgentComponentTesting',
          virtualAgentUseStsAuthentication: 'virtualAgentUseStsAuthentication',
          virtualAgentChatbotSessionPersistenceEnabled:
            'virtualAgentChatbotSessionPersistenceEnabled',
        },
        useToggleValue: name => name === 'virtualAgentShowAiDisclaimer',
      });

      const WebChatComponent = WebChatModule.default;
      const renderMarkdownLocal = WebChatModule.renderMarkdown;

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
      const store = mockStore({});

      const { getByTestId } = render(
        <Provider store={store}>
          <WebChatComponent
            token={token}
            webChatFramework={webChatFramework}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );
      expect(getByTestId('Composer')).to.exist;
      expect(getByTestId('BasicWebChat')).to.exist;
      const composerArgs = webChatFramework.Components.Composer.getCall(0)
        .args[0];
      expect(composerArgs.cardActionMiddleware).to.equal(
        cardActionMiddlewareStub,
      );
      expect(composerArgs.activityMiddleware).to.equal(activityMiddlewareStub);
      expect(composerArgs.styleOptions).to.not.be.undefined;
      expect(composerArgs.directLine).to.equal('fake-directline');
      expect(composerArgs.store).to.equal('fake-webchat-store');
      expect(composerArgs.renderMarkdown).to.equal(renderMarkdownLocal);
      expect(composerArgs.onTelemetry).to.equal(handleTelemetryStub);
      expect(composerArgs.activityStatusMiddleware).to.exist;
    });

    it('should render Composer with args and BasicWebChat and NOT set activityStatusMiddleware if isAIDisclaimerEnabled is false', () => {
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
      const store = mockStore({});

      sandbox.stub(FeatureToggleModule, 'useFeatureToggle').returns({
        TOGGLE_NAMES: {
          virtualAgentShowAiDisclaimer: 'virtualAgentShowAiDisclaimer',
          virtualAgentComponentTesting: 'virtualAgentComponentTesting',
          virtualAgentUseStsAuthentication: 'virtualAgentUseStsAuthentication',
          virtualAgentChatbotSessionPersistenceEnabled:
            'virtualAgentChatbotSessionPersistenceEnabled',
        },
        useToggleValue: () => false,
      });

      const { getByTestId } = render(
        <Provider store={store}>
          <WebChat
            token={token}
            webChatFramework={webChatFramework}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );
      expect(getByTestId('Composer')).to.exist;
      expect(getByTestId('BasicWebChat')).to.exist;
      const composerArgs = webChatFramework.Components.Composer.getCall(0)
        .args[0];
      expect(composerArgs.cardActionMiddleware).to.equal(
        cardActionMiddlewareStub,
      );
      expect(composerArgs.activityMiddleware).to.equal(activityMiddlewareStub);
      expect(composerArgs.styleOptions).to.not.be.undefined;
      expect(composerArgs.directLine).to.equal('fake-directline');
      expect(composerArgs.store).to.equal('fake-webchat-store');
      expect(composerArgs.renderMarkdown).to.equal(renderMarkdown);
      expect(composerArgs.onTelemetry).to.equal(handleTelemetryStub);
      expect(composerArgs.activityStatusMiddleware).to.be.undefined;
    });

    it('should invoke cleanup listeners on unmount when cleanup functions are provided', () => {
      const webChatFramework = getWebChatFramework();
      const setParamLoadingStatus = sandbox.spy();

      stubValues();
      const functionStubs = stubFunctions();
      const cleanupBeforeUnload = sandbox.stub();
      const cleanupSignOut = sandbox.stub();
      functionStubs.clearBotSessionStorageEventListenerStub.returns(
        cleanupBeforeUnload,
      );
      functionStubs.signOutEventListenerStub.returns(cleanupSignOut);

      const { unmount } = render(
        <Provider store={mockStore({})}>
          <WebChat
            token={token}
            webChatFramework={webChatFramework}
            setParamLoadingStatus={setParamLoadingStatus}
          />
        </Provider>,
      );

      unmount();
      expect(cleanupBeforeUnload.calledOnce).to.be.true;
      expect(cleanupSignOut.calledOnce).to.be.true;
    });
  });
});
