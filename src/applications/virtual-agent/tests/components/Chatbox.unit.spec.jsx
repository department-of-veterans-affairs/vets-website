import React from 'react';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import FEATURE_FLAG_NAMES from '@department-of-veterans-affairs/platform-utilities/featureFlagNames';

import * as UseBotOutgoingActivityEventListenerModule from '../../hooks/useBotOutgoingActivityEventListener';
import * as UseWebMessageActivityEventListenerModule from '../../hooks/useWebMessageActivityEventListener';
import Chatbox from '../../components/Chatbox';

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
        [FEATURE_FLAG_NAMES.virtualAgentEnableMsftPvaTesting]: false,
        [FEATURE_FLAG_NAMES.virtualAgentEnableNluPvaTesting]: false,
      },
    ],
  }),
  subscribe: () => {},
  dispatch: () => ({}),
};

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
      sandbox.stub(UseBotOutgoingActivityEventListenerModule, 'default');
      sandbox.stub(UseWebMessageActivityEventListenerModule, 'default');

      const { container } = render(
        <Provider store={mockStore}>
          <Chatbox />
        </Provider>,
      );

      expect($('h2', container).textContent).to.equal('VA chatbot (beta)');
    });
  });
});
