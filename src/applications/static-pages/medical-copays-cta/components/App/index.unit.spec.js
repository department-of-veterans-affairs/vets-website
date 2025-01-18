import React from 'react';
import { expect } from 'chai';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import App from './index';

describe('Medical Copays CTA <App>', () => {
  it('renders what we expect when unauthenticated', () => {
    const mockStore = {
      getState: () => ({
        user: { login: { currentlyLoggedIn: false } },
      }),
      dispatch: () => {},
      subscribe: () => {},
    };
    const { container } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );

    const signInAlert = $('va-alert-sign-in', container);
    expect(signInAlert.getAttribute('variant')).to.eql('signInRequired');
    expect(signInAlert.getAttribute('heading-level')).to.eql('3');

    const signInButton = $('va-button', container);
    fireEvent.click(signInButton);
    expect(signInButton).to.exist;
    cleanup();
  });

  it('renders what we expect when authenticated', () => {
    const mockStore = {
      getState: () => ({ user: { login: { currentlyLoggedIn: true } } }),
      dispatch: () => {},
      subscribe: () => {},
    };
    const { container, queryByText } = render(
      <Provider store={mockStore}>
        <App />
      </Provider>,
    );
    expect($('va-alert', container)).to.exist;
    expect($('h3', container).textContent).includes(
      'Review your VA copay balances',
    );
    expect(queryByText(/Review your current copay balances/i)).to.not.be.null;
    cleanup();
  });
});
