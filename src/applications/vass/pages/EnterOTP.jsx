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
import { FLOW_TYPES, URLS, OTC_ERROR_CODES } from '../utils/constants';
import {
  isAccountLockedError,
  isServerError,
  isAppointmentAlreadyBookedError,
} from '../utils/errors';

const getErrorMessage = (errorCode, attemptsRemaining = 0) => {
  switch (errorCode) {
    case OTC_ERROR_CODES.ACCOUNT_LOCKED:
      return 'The one-time verification code you entered doesn’t match the one we sent you. You can try again in 15 minutes. Check your email and select the link to schedule a call.';
    case OTC_ERROR_CODES.INVALID_OTP:
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
    { isFetching: isCheckingAvailability },
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
      setCode('');
      return;
    }

    const availabilityCheck = await getAppointmentAvailability();

    if (isAppointmentAlreadyBookedError(availabilityCheck.error)) {
      const { appointmentId } = availabilityCheck.error.appointment;
      navigate(`${URLS.ALREADY_SCHEDULED}/${appointmentId}`, { replace: true });
      return;
    }

    if (cancellationFlow) {
      // TODO: handle cancellation flow
      navigate(`${URLS.CANCEL_APPOINTMENT}/abcdef123456`, { replace: true });
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
      errorAlert={isServerError(postOTPVerificationError)}
    >
      {!postOTPVerificationError?.code && (
        <va-alert
          status="success"
          visible
          data-testid="enter-otp-success-alert"
        >
          <p className="vads-u-margin-y--0">
            {`We just emailed a one-time verification code to ${obfuscatedEmail}.
          Please check your email and come back to enter the code to complete
          your verification process and start scheduling your appointment.`}
          </p>
        </va-alert>
      )}

      {postOTPVerificationError?.code && (
        <va-alert status="error" visible data-testid="enter-otp-error-alert">
          <p className="vads-u-margin-y--0">{errorMessage}</p>
        </va-alert>
      )}
      <va-text-input
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
