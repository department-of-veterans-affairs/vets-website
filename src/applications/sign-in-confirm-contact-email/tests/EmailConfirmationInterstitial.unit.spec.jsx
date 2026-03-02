import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { expect } from 'chai';
import { mockApiRequest, resetFetch } from 'platform/testing/unit/helpers';

import EmailConfirmationInterstitial from '../containers/EmailConfirmationInterstitial';

// Helper to build successful transaction response
const buildSuccessResponse = () => ({
  data: {
    id: '',
    type: 'async_transaction_va_profile_email_address_transactions',
    attributes: {
      transactionId: 'test_tx_id',
      transactionStatus: 'COMPLETED_SUCCESS',
      type: 'AsyncTransaction::VAProfile::EmailAddressTransaction',
      metadata: [],
    },
  },
});

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
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    resetFetch();
  });

  it('should update the pathname to / when the user does not have a session', () => {
    const originalLocation = window.location;
    window.location = { pathname: '/sign-in-confirm-contact-email' };
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
        /We’ll send notifications about your VA health care and benefits to this email./i,
      ),
    ).to.not.be.null;
    expect(
      getByText(
        /We’ll send all VA notifications to the contact email address listed in your VA.gov profile. We won’t send any more notifications to the email listed in the previous MyHealtheVet experience. Make sure the contact email address listed in your VA.gov profile is the one you want us to send notifications to./i,
      ),
    ).to.not.be.null;

    const vaLink = container.querySelector('va-link');
    expect(vaLink?.getAttribute('text')).to.equal(
      'Skip for now and go to VA.gov',
    );
  });

  it('renders "No email provided" when the profile emailAddress is missing', () => {
    const mockStore = generateStore('');

    const { getByText } = render(
      <Provider store={mockStore}>
        <EmailConfirmationInterstitial />
      </Provider>,
    );

    expect(getByText(/No email provided/i)).to.not.be.null;
  });

  it('should show the success CTA link after a successful confirmation', async () => {
    localStorage.setItem('hasSession', 'true');
    mockApiRequest(buildSuccessResponse());

    const mockStore = generateStore();
    const { container, getByTestId } = render(
      <Provider store={mockStore}>
        <EmailConfirmationInterstitial />
      </Provider>,
    );

    const confirmButton = getByTestId('sign-in--confirm-email-button');
    expect(confirmButton).to.exist;
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const vaLinkAction = container.querySelector('va-link-action');
      expect(vaLinkAction?.getAttribute('text')).to.equal('Continue to VA.gov');
    });
  });

  it('should render <ErrorConfirm /> when the confirmation request fails', async () => {
    localStorage.setItem('hasSession', 'true');
    mockApiRequest(null, false);

    const mockStore = generateStore();
    const { container, getByTestId } = render(
      <Provider store={mockStore}>
        <EmailConfirmationInterstitial />
      </Provider>,
    );

    const confirmButton = getByTestId('sign-in--confirm-email-button');
    expect(confirmButton).to.exist;

    fireEvent.click(confirmButton);

    await waitFor(() => {
      const errorAlert = container.querySelector('va-alert[status="error"]');
      expect(errorAlert).to.exist;
    });
    const vaLinkAction = container.querySelector('va-link-action');
    expect(vaLinkAction).to.not.exist;
  });
});
