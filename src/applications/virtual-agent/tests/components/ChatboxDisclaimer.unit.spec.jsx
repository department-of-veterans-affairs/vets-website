import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import * as ReactReduxModule from 'react-redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ChatboxDisclaimer from '../../components/ChatboxDisclaimer';
import * as SessionStorageModule from '../../utils/sessionStorage';
import { ACCEPTED } from '../../reducers';

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

      const { getByTestId, container } = render(<ChatboxDisclaimer />);

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

      const { container } = render(<ChatboxDisclaimer />);
      const startChatButton = $('#btnAcceptDisclaimer', container);
      startChatButton.click();

      expect(clearBotSessionStorageStub.calledOnce).to.be.true;
      expect(dispatchStub.calledOnce).to.be.true;
      expect(dispatchStub.calledWithExactly({ type: ACCEPTED })).to.be.true;
    });
  });
});
