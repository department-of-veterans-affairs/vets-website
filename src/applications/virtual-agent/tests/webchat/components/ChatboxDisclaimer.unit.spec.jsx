import { render } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import * as ReactReduxModule from 'react-redux';
import { Provider } from 'react-redux';
import sinon from 'sinon';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import * as FeatureToggleModule from 'platform/utilities/feature-toggles';
import ChatboxDisclaimer from '../../../chatbot/features/shell/components/RightColumnContent';
import { ACCEPTED } from '../../../webchat/reducers';
import * as SessionStorageModule from '../../../webchat/utils/sessionStorage';

const getMockStore = ({ virtualAgentShowAiDisclaimer = null } = {}) => {
  return {
    getState: () => ({
      featureToggles: {
        loading: false,
        [FeatureToggleModule.TOGGLE_NAMES
          .virtualAgentShowAiDisclaimer]: virtualAgentShowAiDisclaimer,
      },
    }),
    subscribe: () => {},
    dispatch: () => ({}),
  };
};

describe('ChatboxDisclaimer', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('ChatboxDisclaimer', () => {
    it('should render the disclaimer and start chat button', () => {
      sandbox.stub(ReactReduxModule, 'useDispatch');
      const mockStore = getMockStore({ virtualAgentShowAiDisclaimer: false });

      const { getByTestId, container } = render(
        <Provider store={mockStore}>
          <ChatboxDisclaimer />
        </Provider>,
      );

      expect(getByTestId('disclaimer')).to.exist;
      expect($('#btnAcceptDisclaimer', container)).to.exist;
    });
    it('should clear session storage and dispatch with type: ACCEPTED when the start chat button is clicked', () => {
      const clearBotSessionStorageStub = sandbox.stub(
        SessionStorageModule,
        'clearBotSessionStorage',
      );
      const dispatchStub = sandbox.stub();
      sandbox.stub(ReactReduxModule, 'useDispatch').returns(dispatchStub);
      const mockStore = getMockStore({ virtualAgentShowAiDisclaimer: false });

      const { container } = render(
        <Provider store={mockStore}>
          <ChatboxDisclaimer />
        </Provider>,
      );
      const startChatButton = $('#btnAcceptDisclaimer', container);
      startChatButton.click();

      expect(clearBotSessionStorageStub.calledOnce).to.be.true;
      expect(dispatchStub.calledOnce).to.be.true;
      expect(dispatchStub.calledWithExactly({ type: ACCEPTED })).to.be.true;
    });
  });
});
