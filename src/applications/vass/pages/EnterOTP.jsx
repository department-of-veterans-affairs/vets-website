import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import { useErrorFocus } from '../hooks/useErrorFocus';
import Wrapper from '../layout/Wrapper';
import {
  usePostOTPVerificationMutation,
  useLazyGetAppointmentAvailabilityQuery,
} from '../redux/api/vassApi';
import {
  selectFlowType,
  selectObfuscatedEmail,
} from '../redux/slices/formSlice';
import {
  FLOW_TYPES,
  URLS,
  OTP_ERROR_CODES,
  VASS_PHONE_NUMBER,
} from '../utils/constants';
import {
  isAccountLockedError,
  isServerError,
  isAppointmentAlreadyBookedError,
  isNotWhithinCohortError,
} from '../utils/errors';

const getErrorMessage = (errorCode, attemptsRemaining = 0) => {
  switch (errorCode) {
    case OTP_ERROR_CODES.ACCOUNT_LOCKED:
      return 'The one-time verification code you entered doesn’t match the one we sent you. You can try again in 15 minutes. Check your email and select the link to schedule a call.';
    case OTP_ERROR_CODES.INVALID_OTP:
      if (attemptsRemaining === 1) {
        return 'The one-time verification code you entered doesn’t match the one we sent you. You have 1 try left. Then you’ll need to wait 15 minutes before trying again.';
      }
      return 'The one-time verification code you entered doesn’t match the one we sent you. Check your email and try again.';
    default:
      return undefined;
  }
};

const getPageTitle = (cancellationFlow, hasError) => {
  if (hasError) {
    return 'We couldn’t verify your information';
  }
  if (cancellationFlow) {
    return 'Cancel VA Solid Start appointment';
  }
  return 'Schedule an appointment with VA Solid Start';
};

const EnterOTP = () => {
  const flowType = useSelector(selectFlowType);
  const cancellationFlow = flowType === FLOW_TYPES.CANCEL;
  const navigate = useNavigate();
  const obfuscatedEmail = useSelector(selectObfuscatedEmail);
  const [
    { error: otpError, handleSetError: setOtpError },
    { handleSetError: setApiError },
  ] = useErrorFocus([
    'va-text-input[name="otp"]',
    'va-alert[data-testid="enter-otp-error-alert"]',
  ]);

  const [code, setCode] = useState('');

  const [
    postOTPVerification,
    { isLoading, error: postOTPVerificationError },
  ] = usePostOTPVerificationMutation();
  const [
    getAppointmentAvailability,
    { isFetching: isCheckingAvailability, error: appointmentAvailabilityError },
  ] = useLazyGetAppointmentAvailabilityQuery();

  const handleSubmit = async () => {
    if (code === '') {
      setOtpError('Please enter your one-time verification code');
      return;
    }

    if (!/^\d+$/.test(code)) {
      setOtpError('Your verification code should only contain numbers');
      return;
    }

    if (code.length !== 6) {
      setOtpError('Your verification code should be 6 digits');
      return;
    }

    const response = await postOTPVerification({
      otp: code,
    });

    if (response.error) {
      setApiError('API Error');
      return;
    }

    const availabilityCheck = await getAppointmentAvailability();

    if (
      isServerError(availabilityCheck.error) ||
      isNotWhithinCohortError(availabilityCheck.error)
    ) {
      return;
    }

    if (isAppointmentAlreadyBookedError(availabilityCheck.error)) {
      const { appointmentId } = availabilityCheck.error.appointment;
      navigate(`${URLS.ALREADY_SCHEDULED}/${appointmentId}`, { replace: true });
      return;
    }

    if (cancellationFlow) {
      const { appointmentId } = availabilityCheck.data;
      navigate(`${URLS.CANCEL_APPOINTMENT}/${appointmentId}`, {
        replace: true,
      });
    } else {
      navigate(URLS.DATE_TIME, { replace: true });
    }
  };

  const errorMessage = getErrorMessage(
    postOTPVerificationError?.code,
    postOTPVerificationError?.attemptsRemaining,
  );
  const pageTitle = getPageTitle(
    cancellationFlow,
    isAccountLockedError(postOTPVerificationError),
  );

  return (
    <Wrapper
      pageTitle={pageTitle}
      verificationError={
        isAccountLockedError(postOTPVerificationError)
          ? errorMessage
          : undefined
      }
      errorAlert={
        isServerError(postOTPVerificationError) ||
        isServerError(appointmentAvailabilityError) ||
        isNotWhithinCohortError(appointmentAvailabilityError)
      }
    >
      {!postOTPVerificationError?.code && (
        <va-alert
          status="success"
          visible
          data-testid="enter-otp-success-alert"
        >
          <h2 slot="headline">
            We’ve emailed you a one-time verification code
          </h2>
          <p
            className="vads-u-margin-y--0 vads-u-margin-bottom--2"
            data-dd-privacy="mask"
          >
            {`We emailed a one-time verification code (OTC) to ${obfuscatedEmail}. Enter the code here to complete your verification process and schedule your appointment.`}
          </p>
          <p className="vads-u-margin-y--0">
            <strong>Note:</strong> If you don’t receive the OTC, request a new
            code using the link in your original email. Or call us at{' '}
            <va-telephone
              contact={VASS_PHONE_NUMBER}
              data-testid="solid-start-telephone"
            />{' '}
            to schedule. We’re here Monday through Friday, 8:00 a.m. to 9:00
            p.m. ET.
          </p>
        </va-alert>
      )}

      {postOTPVerificationError?.code && (
        <va-alert status="error" visible data-testid="enter-otp-error-alert">
          <p className="vads-u-margin-y--0">{errorMessage}</p>
        </va-alert>
      )}
      <va-text-input
        data-dd-privacy="mask"
        class="vads-u-margin-top--4"
        label="Enter your one-time verification code"
        name="otp"
        value={code}
        inputmode="numeric"
        maxlength="6"
        onBlur={e => {
          if (e.target.value !== '') {
            setOtpError('');
          }
        }}
        onInput={e => {
          setCode(e.target.value);
        }}
        required
        error={otpError}
        data-testid="otp-input"
        autocomplete="one-time-code"
        show-input-error
      />
      <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container vass-flex-direction--column">
        <va-button
          big
          onClick={handleSubmit}
          text="Continue"
          data-testid="continue-button"
          uswds
          loading={isLoading || isCheckingAvailability}
        />
      </div>
    </Wrapper>
  );
};

export default EnterOTP;
