import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
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

describe('Declined', () => {
  let store;
  let dispatchStub;

  beforeEach(() => {
    dispatchStub = sinon.stub();

    store = generateStore(dispatchStub);
  });
  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <Declined />
      </Provider>,
    );
    expect($('h1', container).textContent).to.eql('We’ve signed you out');
    expect($('button', container).textContent).to.eql('Sign in');
  });

  it('should render', () => {
    const { container } = render(
      <Provider store={store}>
        <Declined />
      </Provider>,
    );

    const signInButton = $('button', container);
    fireEvent.click(signInButton);

    expect(dispatchStub.calledOnce).to.be.true;
    expect(dispatchStub.calledWith(toggleLoginModal(true))).to.be.true;
  });
});
