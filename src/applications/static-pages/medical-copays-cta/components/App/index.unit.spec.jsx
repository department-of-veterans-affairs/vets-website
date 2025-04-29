import React from 'react';
import { expect } from 'chai';
import { fireEvent, cleanup } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';

import { App } from '.';

describe('Medical Copays CTA <App>', () => {
  afterEach(cleanup);

  it('renders va-alert-sign-in to unauthenticated user', () => {
    const { container } = renderInReduxProvider(<App />, {
      initialState: {
        user: { login: { currentlyLoggedIn: false } },
      },
    });
    expect(container.querySelector('va-alert-sign-in')).to.exist;
  });

  it('opens sign-in modal when Sign in button is clicked', () => {
    const { container } = renderInReduxProvider(<App />, {
      initialState: {
        user: { login: { currentlyLoggedIn: false } },
      },
    });
    const signInButton = container.querySelector('va-button');
    fireEvent.click(signInButton);
    expect(container.querySelector('va-button')).to.exist;
  });

  it('renders what we expect when authenticated', () => {
    const { container } = renderInReduxProvider(<App />, {
      initialState: {
        user: { login: { currentlyLoggedIn: true } },
      },
    });
    const vaAlert = container.querySelector('va-alert');
    expect(container.querySelector('va-alert-sign-in')).to.not.exist;
    expect(vaAlert).to.exist;
    expect(vaAlert.getAttribute('status')).to.eql('info');
    expect(container.querySelector('[slot="headline"]').textContent).to.eql(
      'Review your VA copay balances',
    );
  });
});
