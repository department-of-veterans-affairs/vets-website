import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { toggleLoginModal } from 'platform/site-wide/user-nav/actions';
import Declined from '../components/Declined';

const generateStore = dispatch => ({
  getState: () => ({
    navigation: {
      showLoginModal: false,
    },
  }),
  subscribe: sinon.stub(),
  dispatch,
});

const oldLocation = global.window.location;

describe('Declined', () => {
  let store;
  let dispatchStub;

  beforeEach(() => {
    dispatchStub = sinon.stub();
    store = generateStore(dispatchStub);
  });

  afterEach(() => {
    dispatchStub = undefined;
    store = {};
  });

  after(() => {
    global.window.location = oldLocation;
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <Declined />
      </Provider>,
    );

    expect($('h1', container).textContent).to.eql('We’ve signed you out');
    expect($('va-button[text="Sign in"]', container)).to.not.be.null;
  });

  context('sign in button clicked', () => {
    it('dispatch toggleLoginModal action', () => {
      const { container } = render(
        <Provider store={store}>
          <Declined />
        </Provider>,
      );

      const signInButton = $('va-button', container);
      fireEvent.click(signInButton);

      expect(dispatchStub.calledOnce).to.be.true;
      expect(dispatchStub.calledWith(toggleLoginModal(true))).to.be.true;
    });

    it('should redirect to vamobile when session storage exists', async () => {
      sessionStorage.setItem('ci', 'vamobile');
      const { container } = render(
        <Provider store={store}>
          <Declined />
        </Provider>,
      );

      const signInButton = $('va-button', container);
      fireEvent.click(signInButton);

      await waitFor(() => {
        expect(global.window.location).to.eql(
          'vamobile://login-terms-rejected',
        );
      });
      sessionStorage.removeItem('ci');
    });
  });
});
