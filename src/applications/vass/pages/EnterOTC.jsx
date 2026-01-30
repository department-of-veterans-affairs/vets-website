import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { useSelector } from 'react-redux';
import { useErrorFocus } from '../hooks/useErrorFocus';
import Wrapper from '../layout/Wrapper';
import { usePostOTCVerificationMutation } from '../redux/api/vassApi';
import {
  selectFlowType,
  selectObfuscatedEmail,
} from '../redux/slices/formSlice';
import { FLOW_TYPES, URLS, OTC_ERROR_CODES } from '../utils/constants';
import { isAccountLockedError, isServerError } from '../utils/errors';

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

const EnterOTC = () => {
  const flowType = useSelector(selectFlowType);
  const cancellationFlow = flowType === FLOW_TYPES.CANCEL;
  const navigate = useNavigate();
  const obfuscatedEmail = useSelector(selectObfuscatedEmail);
  const [
    { error: otcError, handleSetError: setOtcError },
    { handleSetError: setApiError },
  ] = useErrorFocus([
    'va-text-input[name="otc"]',
    'va-alert[data-testid="enter-otc-error-alert"]',
  ]);

  const [code, setCode] = useState('');

  const [
    postOTCVerification,
    { isLoading, error: postOTCVerificationError },
  ] = usePostOTCVerificationMutation();

  const handleSubmit = async () => {
    if (code === '') {
      setOtcError('Please enter your one-time verification code');
      return;
    }

    const response = await postOTCVerification({
      otc: code,
    });

    if (response.error) {
      setApiError('API Error');
      setCode('');
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
    postOTCVerificationError?.code,
    postOTCVerificationError?.attemptsRemaining,
  );
  const pageTitle = getPageTitle(
    cancellationFlow,
    isAccountLockedError(postOTCVerificationError),
  );

  return (
    <Wrapper
      pageTitle={pageTitle}
      verificationError={
        isAccountLockedError(postOTCVerificationError)
          ? errorMessage
          : undefined
      }
      errorAlert={isServerError(postOTCVerificationError)}
    >
      {!postOTCVerificationError?.code && (
        <va-alert
          status="success"
          visible
          data-testid="enter-otc-success-alert"
        >
          <p className="vads-u-margin-y--0">
            {`We just emailed a one-time verification code to ${obfuscatedEmail}.
          Please check your email and come back to enter the code to complete
          your verification process and start scheduling your appointment.`}
          </p>
        </va-alert>
      )}

      {postOTCVerificationError?.code && (
        <va-alert status="error" visible data-testid="enter-otc-error-alert">
          <p className="vads-u-margin-y--0">{errorMessage}</p>
        </va-alert>
      )}
      <va-text-input
        class="vads-u-margin-top--4"
        label="Enter your one-time verification code"
        name="otc"
        value={code}
        onBlur={e => {
          if (e.target.value !== '') {
            setOtcError('');
          }
        }}
        onInput={e => {
          setCode(e.target.value);
        }}
        required
        error={otcError}
        data-testid="otc-input"
        show-input-error
      />
      <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container vass-flex-direction--column">
        <va-button
          big
          onClick={handleSubmit}
          text="Continue"
          data-testid="continue-button"
          uswds
          loading={isLoading}
        />
      </div>
    </Wrapper>
  );
};

export default EnterOTC;
