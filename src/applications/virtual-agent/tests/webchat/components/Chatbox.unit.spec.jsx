import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';
import * as FeatureToggleHooks from 'platform/utilities/feature-toggles/useFeatureToggle';

import Chatbox from '../../../webchat/components/Chatbox';
import * as UseBotOutgoingActivityEventListenerModule from '../../../webchat/hooks/useBotOutgoingActivityEventListener';
import * as UseWebMessageActivityEventListenerModule from '../../../webchat/hooks/useWebMessageActivityEventListener';

const mockStore = {
  getState: () => ({
    user: {
      login: {
        currentlyLoggedIn: true,
      },
    },
    virtualAgentData: {
      termsAccepted: true,
    },
    featureToggles: [
      {
        [FEATURE_FLAG_NAMES.virtualAgentEnableParamErrorDetection]: false,
      },
    ],
  }),
  subscribe: () => {},
  dispatch: () => ({}),
};

const mockFeatureToggle = (isSessionPersistenceEnabled = false) => ({
  useToggleValue: name =>
    name === 'virtualAgentChatbotSessionPersistenceEnabled'
      ? isSessionPersistenceEnabled
      : false,
  TOGGLE_NAMES: {
    virtualAgentChatbotSessionPersistenceEnabled:
      'virtualAgentChatbotSessionPersistenceEnabled',
  },
});

describe('Chatbox', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Chatbox', () => {
    it('should setup the useBotOutgoingActivityEventListener and useWebMessageActivityEventListener', () => {
      sandbox
        .stub(FeatureToggleHooks, 'useFeatureToggle')
        .returns(mockFeatureToggle(false));
      const useBotOutgoingActivityEventListenerStub = sandbox.stub(
        UseBotOutgoingActivityEventListenerModule,
        'default',
      );
      const useWebMessageActivityEventListenerStub = sandbox.stub(
        UseWebMessageActivityEventListenerModule,
        'default',
      );

      render(
        <Provider store={mockStore}>
          <Chatbox />
        </Provider>,
      );

      expect(useBotOutgoingActivityEventListenerStub.calledOnce).to.be.true;
      expect(useWebMessageActivityEventListenerStub.calledOnce).to.be.true;
    });

    it('should render the Bot component', () => {
      sandbox
        .stub(FeatureToggleHooks, 'useFeatureToggle')
        .returns(mockFeatureToggle(false));
      sandbox.stub(UseBotOutgoingActivityEventListenerModule, 'default');
      sandbox.stub(UseWebMessageActivityEventListenerModule, 'default');

      const { container } = render(
        <Provider store={mockStore}>
          <Chatbox />
        </Provider>,
      );

      expect($('h2', container).textContent).to.equal('VA chatbot (beta)');
    });

    it('should enable reload guard when session persistence is OFF', () => {
      sandbox
        .stub(FeatureToggleHooks, 'useFeatureToggle')
        .returns(mockFeatureToggle(false));
      const useBotOutgoingActivityEventListenerStub = sandbox.stub(
        UseBotOutgoingActivityEventListenerModule,
        'default',
      );
      sandbox.stub(UseWebMessageActivityEventListenerModule, 'default');

      render(
        <Provider store={mockStore}>
          <Chatbox />
        </Provider>,
      );

      // Second argument should be true (enabled) when persistence is OFF
      expect(useBotOutgoingActivityEventListenerStub.calledOnce).to.be.true;
      const [
        ,
        enabled,
      ] = useBotOutgoingActivityEventListenerStub.firstCall.args;
      expect(enabled).to.be.true;
    });

    it('should disable reload guard when session persistence is ON', () => {
      sandbox
        .stub(FeatureToggleHooks, 'useFeatureToggle')
        .returns(mockFeatureToggle(true));
      const useBotOutgoingActivityEventListenerStub = sandbox.stub(
        UseBotOutgoingActivityEventListenerModule,
        'default',
      );
      sandbox.stub(UseWebMessageActivityEventListenerModule, 'default');

      render(
        <Provider store={mockStore}>
          <Chatbox />
        </Provider>,
      );

      // Second argument should be false (disabled) when persistence is ON
      expect(useBotOutgoingActivityEventListenerStub.calledOnce).to.be.true;
      const [
        ,
        enabled,
      ] = useBotOutgoingActivityEventListenerStub.firstCall.args;
      expect(enabled).to.be.false;
    });
  });
});
