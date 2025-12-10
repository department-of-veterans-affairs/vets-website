import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { Routes, Route, useLocation } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  mockFetch,
  setFetchJSONFailure,
  inputVaTextInput,
  resetFetch,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import EnterOTC from './EnterOTC';
import reducers from '../redux/reducers';
import { vassApi } from '../redux/api/vassApi';

// Helper component to display current location for testing navigation
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}</div>;
};

describe('VASS Component: EnterOTC', () => {
  const renderComponent = (path = '/enter-otc') =>
    renderWithStoreAndRouterV6(<EnterOTC />, {
      initialState: {},
      reducers,
      additionalMiddlewares: [vassApi.middleware],
      path,
    });

  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should initialize correctly', () => {
    const screen = renderComponent();

    expect(screen.getByTestId('header')).to.exist;
  });

  it('should render success alert with verification message', () => {
    const { container } = renderComponent();
    const alert = container.querySelector('va-alert[status="success"]');

    expect(alert).to.exist;
    expect(alert.getAttribute('visible')).to.exist;
  });

  it('should display email address in alert message', () => {
    const { getByText } = renderComponent();

    expect(getByText(/We just emailed a one-time verification code to/i)).to
      .exist;
    expect(getByText(/test@test.com/i)).to.exist;
  });

  it('should render OTC input field', () => {
    const { container } = renderComponent();
    const otcInput = container.querySelector('va-text-input[name="otc"]');

    expect(otcInput).to.exist;
    expect(otcInput.getAttribute('label')).to.equal(
      'Enter your one-time verification code',
    );
    expect(otcInput.getAttribute('required')).to.exist;
  });

  it('should render continue button', () => {
    const { container } = renderComponent();
    const continueButton = container.querySelector('va-button');

    expect(continueButton).to.exist;
    expect(continueButton.getAttribute('text')).to.equal('Continue');
  });

  describe('form validation', () => {
    it('should show field error when submitting with empty code', async () => {
      const { container } = renderComponent();
      const continueButton = container.querySelector('va-button');

      continueButton.click();

      await waitFor(() => {
        const otcInput = container.querySelector('va-text-input[name="otc"]');
        expect(otcInput.getAttribute('error')).to.equal(
          'Please enter your one-time verification code',
        );
      });
    });
  });

  describe('API error handling', () => {
    it('should display error alert for invalid_otc with multiple attempts remaining', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), {
        errors: [
          {
            code: 'invalid_otc',
            detail: 'Invalid or expired OTC',
            attemptsRemaining: 2,
            status: 401,
          },
        ],
      });
      const { container } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = container.querySelector('va-button');
      continueButton.click();
      await waitFor(() => {
        const errorAlert = container.querySelector(
          'va-alert[status="error"][data-testid="enter-otc-error-alert"]',
        );
        expect(errorAlert).to.exist;
        expect(errorAlert.textContent).to.include(
          'The one-time verification code you entered doesn’t match the one we sent you. Check your email and try again.',
        );
      });
    });
    it('should display specific error message when only 1 attempt remaining', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), {
        errors: [
          {
            code: 'invalid_otc',
            detail: 'Invalid or expired OTC',
            attemptsRemaining: 1,
            status: 401,
          },
        ],
      });
      const { container } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = container.querySelector('va-button');
      continueButton.click();
      await waitFor(() => {
        const errorAlert = container.querySelector(
          'va-alert[status="error"][data-testid="enter-otc-error-alert"]',
        );
        expect(errorAlert).to.exist;
        expect(errorAlert.textContent).to.include(
          'The one-time verification code you entered doesn’t match the one we sent you. You have 1 try left.',
        );
      });
    });
    it('should display account locked error message', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), {
        errors: [
          {
            code: 'account_locked',
            detail: 'Too many failed attempts',
            status: 401,
            retryAfter: 900,
          },
        ],
      });
      const { container } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = container.querySelector('va-button');
      continueButton.click();
      await waitFor(() => {
        const errorAlert = container.querySelector(
          'va-alert[status="error"][data-testid="enter-otc-error-alert"]',
        );
        expect(errorAlert).to.exist;
        expect(errorAlert.textContent).to.include(
          'The one-time verification code you entered doesn’t match the one we sent you. You can try again in 15 minutes.',
        );
      });
    });
    it('should hide success alert when error is displayed', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), {
        errors: [
          {
            code: 'invalid_otc',
            detail: 'Invalid or expired OTC',
            attemptsRemaining: 2,
            status: 401,
          },
        ],
      });
      const { container } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = container.querySelector('va-button');
      continueButton.click();
      await waitFor(() => {
        const successAlert = container.querySelector(
          'va-alert[status="success"]',
        );
        const errorAlert = container.querySelector('va-alert[status="error"]');
        expect(errorAlert).to.exist;
        expect(successAlert).to.not.exist;
      });
    });
    it('should clear the OTC input after an error', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), {
        errors: [
          {
            code: 'invalid_otc',
            detail: 'Invalid or expired OTC',
            attemptsRemaining: 2,
            status: 401,
          },
        ],
      });
      const { container } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = container.querySelector('va-button');
      continueButton.click();
      await waitFor(() => {
        const otcInput = container.querySelector('va-text-input[name="otc"]');
        expect(otcInput.getAttribute('value')).to.equal('');
      });
    });
  });

  describe('successful OTC verification', () => {
    it('should navigate to date-time page on successful verification', async () => {
      setFetchJSONResponse(global.fetch.onCall(0), {
        data: {
          token: 'jwt-token',
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      });

      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path="/enter-otc" element={<EnterOTC />} />
            <Route path="/date-time" element={<div>Date Time Page</div>} />
          </Routes>
          <LocationDisplay />
        </>,
        {
          initialState: {},
          reducers,
          initialEntries: ['/enter-otc'],
          additionalMiddlewares: [vassApi.middleware],
        },
      );

      // Verify we start on the enter-otc page
      expect(getByTestId('location-display').textContent).to.equal(
        '/enter-otc',
      );

      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = container.querySelector('va-button');
      continueButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          '/date-time',
        );
      });
    });
  });
});
