import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
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

import EnterOTP from './EnterOTP';
import { getDefaultRenderOptions, LocationDisplay } from '../utils/test-utils';
import * as authUtils from '../utils/auth';
import { FLOW_TYPES, URLS } from '../utils/constants';
import {
  createOTPInvalidError,
  createOTPAccountLockedError,
  createAppointmentAlreadyBookedError,
} from '../services/mocks/utils/errors';
import { createAppointmentAvailabilityResponse } from '../services/mocks/utils/responses';

const defaultRenderOptions = getDefaultRenderOptions({
  obfuscatedEmail: 't***@test.com',
  uuid: 'c0ffee-1234-beef-5678',
  lastName: 'Smith',
  dob: '1935-04-07',
  flowType: FLOW_TYPES.SCHEDULE, // default to schedule flow for testing
});

const defaultRenderOptionsWithCancelFlow = getDefaultRenderOptions({
  obfuscatedEmail: 't***@test.com',
  uuid: 'c0ffee-1234-beef-5678',
  lastName: 'Smith',
  dob: '1935-04-07',
  flowType: FLOW_TYPES.CANCEL,
});

const renderComponent = () =>
  renderWithStoreAndRouterV6(<EnterOTP />, defaultRenderOptions);

describe('VASS Component: EnterOTP', () => {
  let getVassTokenStub;

  beforeEach(() => {
    mockFetch();
    getVassTokenStub = sinon
      .stub(authUtils, 'getVassToken')
      .returns('mock-token');
  });

  afterEach(() => {
    resetFetch();
    getVassTokenStub.restore();
  });

  it('should initialize correctly', () => {
    const screen = renderComponent();

    expect(screen.getByTestId('header')).to.exist;
    expect(screen.getByTestId('enter-otp-success-alert')).to.exist;
    expect(
      screen.getByTestId('enter-otp-success-alert').textContent,
    ).to.contain(defaultRenderOptions.initialState.vassForm.obfuscatedEmail);
    expect(screen.queryByTestId('enter-otp-error-alert')).to.not.exist;
    const otpInput = screen.getByTestId('otp-input');
    expect(otpInput).to.exist;
    expect(otpInput.getAttribute('label')).to.match(
      /Enter your one-time verification code/i,
    );
    expect(otpInput.getAttribute('required')).to.exist;
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
        const otpInput = getByTestId('otp-input');
        expect(otpInput.getAttribute('error')).to.match(
          /Please enter your one-time verification code/i,
        );
      });
    });

    it('should show error when code contains non-numeric characters', async () => {
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, 'abc123', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');

      continueButton.click();

      await waitFor(() => {
        const otpInput = getByTestId('otp-input');
        expect(otpInput.getAttribute('error')).to.match(
          /Your verification code should only contain numbers/i,
        );
      });
    });

    it('should show error when code is fewer than 6 digits', async () => {
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '12345', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');

      continueButton.click();

      await waitFor(() => {
        const otpInput = getByTestId('otp-input');
        expect(otpInput.getAttribute('error')).to.match(
          /Your verification code should be 6 digits/i,
        );
      });
    });

    it('should show error when code is more than 6 digits', async () => {
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '1234567', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');

      continueButton.click();

      await waitFor(() => {
        const otpInput = getByTestId('otp-input');
        expect(otpInput.getAttribute('error')).to.match(
          /Your verification code should be 6 digits/i,
        );
      });
    });

    it('should have correct input attributes for numeric entry', () => {
      const { getByTestId } = renderComponent();
      const otpInput = getByTestId('otp-input');

      expect(otpInput.getAttribute('inputmode')).to.equal('numeric');
      expect(otpInput.getAttribute('maxlength')).to.equal('6');
    });

    it('should not show validation error for valid 6-digit code', async () => {
      setFetchJSONResponse(global.fetch.onCall(0), {
        data: {
          token: 'jwt-token',
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      });
      setFetchJSONResponse(
        global.fetch.onCall(1),
        createAppointmentAvailabilityResponse({
          appointmentId: 'abcdef123456',
        }),
      );
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');

      continueButton.click();

      await waitFor(() => {
        const otpInput = getByTestId('otp-input');
        // No validation error should be present - API call should proceed
        // Error attribute will be empty string (not null) when no error
        expect(otpInput.getAttribute('error')).to.equal('');
      });
    });
  });

  describe('API error handling', () => {
    it('should display error alert for invalid_otp with multiple attempts remaining', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createOTPInvalidError(2));
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        const errorAlert = getByTestId('enter-otp-error-alert');
        expect(errorAlert).to.exist;
        expect(errorAlert.textContent).to.match(
          /The one-time verification code you entered doesn’t match the one we sent you. Check your email and try again./i,
        );
      });
    });
    it('should display specific error message when only 1 attempt remaining', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createOTPInvalidError(1));
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        const errorAlert = getByTestId('enter-otp-error-alert');
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
      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
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
      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        expect(getByTestId('enter-otp-error-alert')).to.exist;
        expect(queryByTestId('enter-otp-success-alert')).to.not.exist;
      });
    });
    it('should clear the otp input after an error', async () => {
      setFetchJSONFailure(global.fetch.onCall(0), createOTPInvalidError(2));
      const { container, getByTestId } = renderComponent();
      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();
      await waitFor(() => {
        const otpInput = getByTestId('otp-input');
        expect(otpInput.getAttribute('value')).to.equal('');
      });
    });
  });

  describe('successful otp verification', () => {
    it('should navigate to date-time page on successful verification', async () => {
      setFetchJSONResponse(global.fetch.onCall(0), {
        data: {
          token: 'jwt-token',
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      });
      setFetchJSONResponse(
        global.fetch.onCall(1),
        createAppointmentAvailabilityResponse({
          appointmentId: 'abcdef123456',
        }),
      );

      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path={URLS.ENTER_OTP} element={<EnterOTP />} />
            <Route path={URLS.DATE_TIME} element={<div>Date Time Page</div>} />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [URLS.ENTER_OTP],
        },
      );

      // Verify we start on the enter-otp page
      expect(getByTestId('location-display').textContent).to.equal(
        URLS.ENTER_OTP,
      );

      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          URLS.DATE_TIME,
        );
      });
    });
  });

  describe('appointment already booked redirect', () => {
    it('should navigate to already-scheduled page when user has existing appointment', async () => {
      setFetchJSONResponse(global.fetch.onCall(0), {
        data: {
          token: 'jwt-token',
          expiresIn: 3600,
          tokenType: 'Bearer',
        },
      });
      setFetchJSONFailure(
        global.fetch.onCall(1),
        createAppointmentAlreadyBookedError('appt-123'),
      );

      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path={URLS.ENTER_OTP} element={<EnterOTP />} />
            <Route
              path={`${URLS.ALREADY_SCHEDULED}/:appointmentId`}
              element={<div>Already Scheduled Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptions,
          initialEntries: [URLS.ENTER_OTP],
        },
      );

      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
      const continueButton = getByTestId('continue-button');
      continueButton.click();

      await waitFor(() => {
        expect(getByTestId('location-display').textContent).to.equal(
          `${URLS.ALREADY_SCHEDULED}/appt-123`,
        );
      });
    });
  });

  describe('when cancellation flow is active', () => {
    it('should display the correct page title', () => {
      const { getByTestId } = renderWithStoreAndRouterV6(<EnterOTP />, {
        ...defaultRenderOptionsWithCancelFlow,
        initialEntries: [URLS.ENTER_OTP],
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
      setFetchJSONResponse(
        global.fetch.onCall(1),
        createAppointmentAvailabilityResponse({
          appointmentId: 'abcdef123456',
        }),
      );

      const { container, getByTestId } = renderWithStoreAndRouterV6(
        <>
          <Routes>
            <Route path={URLS.ENTER_OTP} element={<EnterOTP />} />
            <Route
              path={`${URLS.CANCEL_APPOINTMENT}/:appointmentId`}
              element={<div>Cancel Appointment Page</div>}
            />
          </Routes>
          <LocationDisplay />
        </>,
        {
          ...defaultRenderOptionsWithCancelFlow,
          initialEntries: [URLS.ENTER_OTP],
        },
      );

      inputVaTextInput(container, '123456', 'va-text-input[name="otp"]');
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
