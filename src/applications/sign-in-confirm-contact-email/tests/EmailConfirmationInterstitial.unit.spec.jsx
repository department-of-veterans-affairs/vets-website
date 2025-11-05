import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import EmailConfirmationInterstitial from '../containers/EmailConfirmationInterstitial';

const generateStore = (email = 'test@test.com') => ({
  getState: () => ({
    user: {
      profile: {
        vapContactInfo: {
          email: {
            id: 123,
            emailAddress: email,
            confirmationDate: new Date().toISOString(),
          },
        },
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
});

describe('EmailConfirmationInterstitial', () => {
  it('should update the pathname to / when the user does not have a session', () => {
    const originalLocation = window.location;
    window.location = { pathname: '/sign-in-confirm-contact-email' };
    // Node 22 compatibility
    window.location.pathname = '/sign-in-confirm-contact-email';
    const mockStore = generateStore();
    render(
      <Provider store={mockStore}>
        <EmailConfirmationInterstitial />
      </Provider>,
    );
    expect(window.location.pathname).to.equal('/');
    window.location = originalLocation;
  });

  it('should not update the pathname when the user has a session', () => {
    const originalLocation = window.location;
    window.location = { pathname: '/sign-in-confirm-contact-email' };
    // Node 22 compatibility
    window.location.pathname = '/sign-in-confirm-contact-email';
    localStorage.setItem('hasSession', 'true');
    const mockStore = generateStore();
    render(
      <Provider store={mockStore}>
        <EmailConfirmationInterstitial />
      </Provider>,
    );
    expect(window.location.pathname).to.equal('/sign-in-confirm-contact-email');
    window.location = originalLocation;
    localStorage.clear();
  });

  it('renders static content correctly', () => {
    const mockStore = generateStore();
    const { getByRole, getByText, container } = render(
      <Provider store={mockStore}>
        <EmailConfirmationInterstitial />
      </Provider>,
    );
    expect(getByRole('heading', { name: /Confirm your contact email/i })).to.not
      .be.null;
    expect(getByRole('heading', { level: 2, name: /Contact email address/i }))
      .to.not.be.null;
    expect(
      getByText(
        /We'll send notifications about your VA health care and benefits to this email./i,
      ),
    ).to.not.be.null;
    expect(
      getByText(
        /We'll send all VA notifications to the contact email address listed in your VA.gov profile. We won't send any more notifications to the email listed in the previous MyHealtheVet experience. Make sure the contact email address listed in your VA.gov profile is the one you want us to send notifications to./i,
      ),
    ).to.not.be.null;

    const vaLink = container.querySelector('va-link');
    expect(vaLink?.getAttribute('text')).to.equal(
      'Skip for now and go to VA.gov',
    );
  });

  it('should call the handleConfirmation function when the Confirm button is clicked', async () => {
    const mockStore = generateStore();
    mockApiRequest();

    const { container } = render(
      <Provider store={mockStore}>
        <EmailConfirmationInterstitial />
      </Provider>,
    );

    const confirmButton = container.querySelector('.confirm-button');
    expect(confirmButton).to.exist;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const vaLink = container.querySelector('va-link-action');
      expect(vaLink?.getAttribute('text')).to.equal('Continue to VA.gov');
    });
  });
});
