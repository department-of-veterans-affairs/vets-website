import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom-v5-compat';
import { renderWithStoreAndRouterV6 } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import {
  mockFetch,
  setFetchJSONFailure,
  inputVaTextInput,
  resetFetch,
  setFetchJSONResponse,
} from '@department-of-veterans-affairs/platform-testing/helpers';

import EnterOTC from './EnterOTC';
import { getDefaultRenderOptions, LocationDisplay } from '../utils/test-utils';
import { FLOW_TYPES, URLS } from '../utils/constants';
import {
  createOTPInvalidError,
  createOTPAccountLockedError,
} from '../services/mocks/utils/errors';

const defaultRenderOptions = getDefaultRenderOptions({
  obfuscatedEmail: 't***@test.com',
  uuid: 'c0ffee-1234-beef-5678',
  lastname: 'Smith',
  dob: '1935-04-07',
  flowType: FLOW_TYPES.SCHEDULE, // default to schedule flow for testing
});

const defaultRenderOptionsWithCancelFlow = getDefaultRenderOptions({
  obfuscatedEmail: 't***@test.com',
  uuid: 'c0ffee-1234-beef-5678',
  lastname: 'Smith',
  dob: '1935-04-07',
  flowType: FLOW_TYPES.CANCEL,
});

const renderComponent = () =>
  renderWithStoreAndRouterV6(<EnterOTC />, defaultRenderOptions);

describe('VASS Component: EnterOTC', () => {
  beforeEach(() => {
    mockFetch();
  });

  afterEach(() => {
    resetFetch();
  });

  it('should initialize correctly', () => {
    const screen = renderComponent();

    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('enter-otc-success-alert')).to.exist;
    expect(
      screen.getByTestId('enter-otc-success-alert').textContent,
    ).to.contain(defaultRenderOptions.initialState.vassForm.obfuscatedEmail);
    expect(screen.queryByTestId('enter-otc-error-alert')).to.not.exist;
    const otcInput = screen.getByTestId('otc-input');
    expect(otcInput).to.exist;
    expect(otcInput.getAttribute('label')).to.match(
      /Enter your one-time verification code/i,
    );
    expect(otcInput.getAttribute('required')).to.exist;
    expect(screen.getByTestId('continue-button')).to.exist;
    expect(screen.getByTestId('continue-button').getAttribute('text')).to.match(
      /Continue/i,
    );
  });

  describe('form validation', () => {
    it('should show field error when submitting with empty code', async () => {
      const { getByTestId } = renderComponent();
      const continueButton = getByTestId('continue-button');

      continueButton.click();

      await waitFor(() => {
        const otcInput = getByTestId('otc-input');
        expect(otcInput.getAttribute('error')).to.match(
          /Please enter your one-time verification code/i,
        );
      });
    });
  });

  describe('API error handling', () => {
    it('should display error alert for invalid_otc with multiple attempts remaining', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createOTPInvalidError(2));
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        const errorAlert = getByTestId('enter-otc-error-alert');
        expect(errorAlert).to.exist;
        expect(errorAlert.textContent).to.match(
          /The one-time verification code you entered doesn’t match the one we sent you. Check your email and try again./i,
        );
      });
    });
    it('should display specific error message when only 1 attempt remaining', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createOTPInvalidError(1));
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        const errorAlert = getByTestId('enter-otc-error-alert');
        expect(errorAlert).to.exist;
        expect(errorAlert.textContent).to.match(
          /The one-time verification code you entered doesn’t match the one we sent you. You have 1 try left./i,
        );
      });
    });
    it('should display account locked error message', async () => {
      setFetchJSONFailure(
        global.fetch.onCall(0),
        createOTPAccountLockedError(900),
      );
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        const errorAlert = getByTestId('verification-error-alert');
        expect(errorAlert).to.exist;
        expect(errorAlert.textContent).to.match(
          /The one-time verification code you entered doesn’t match the one we sent you. You can try again in 15 minutes./i,
        );
      });
    });
    it('should hide success alert when error is displayed', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createOTPInvalidError(2));
      const { container, getByTestId, queryByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        expect(getByTestId('enter-otc-error-alert')).to.exist;
        expect(queryByTestId('enter-otc-success-alert')).to.not.exist;
      });
    });
    it('should clear the OTC input after an error', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createOTPInvalidError(2));
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        const otcInput = getByTestId('otc-input');
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
            <Route path={URLS.ENTER_OTC} element={<EnterOTC />} />
            <Route path={URLS.DATE_TIME} element={<div>Date Time Page</div>} />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [URLS.ENTER_OTC],
        },
      );

      // Verify we start on the enter-otc page
      expect(getByTestId('location-display').textContent).to.equal(
        URLS.ENTER_OTC,
      );

      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.DATE_TIME,
        );
      });
    });
  });

  describe('when cancellation flow is active', () => {
    it('should display the correct page title', () => {
      const { getByTestId } = renderWithStoreAndRouterV6(<EnterOTC />, {
        ...defaultRenderOptionsWithCancelFlow,
        initialEntries: [URLS.ENTER_OTC],
      });

      expect(getByTestId('header').textContent).to.contain(
        'Cancel VA Solid Start appointment',
      );
    });

    it('should navigate to cancel appointment page on successful verification', async () => {
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
            <Route path={URLS.ENTER_OTC} element={<EnterOTC />} />
            <Route
              path={`${URLS.CANCEL_APPOINTMENT}/:appointmentId`}
              element={<div>Cancel Appointment Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptionsWithCancelFlow,
          initialEntries: [URLS.ENTER_OTC],
        },
      );

      inputVaTextInput(container, '123456', 'va-text-input[name="otc"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          `${URLS.CANCEL_APPOINTMENT}/abcdef123456`,
        );
      });
    });
  });
});
