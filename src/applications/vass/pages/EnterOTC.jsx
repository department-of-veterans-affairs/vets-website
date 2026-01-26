import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import { focusElement } from 'platform/utilities/ui';
import { useSelector } from 'react-redux';
import Wrapper from '../layout/Wrapper';
import { usePostOTCVerificationMutation } from '../redux/api/vassApi';
import { selectObfuscatedEmail } from '../redux/slices/formSlice';
import { URLS } from '../utils/constants';

const getErrorMessage = (errorCode, attemptsRemaining = 0) => {
  switch (errorCode) {
    case 'account_locked':
      return 'The one-time verification code you entered doesn’t match the one we sent you. You can try again in 15 minutes. Check your email and select the link to schedule a call.';
    case 'invalid_otc':
      if (attemptsRemaining === 1) {
        return 'The one-time verification code you entered doesn’t match the one we sent you. You have 1 try left. Then you’ll need to wait 15 minutes before trying again.';
      }
      return 'The one-time verification code you entered doesn’t match the one we sent you. Check your email and try again.';
    default:
      return undefined;
  }
};

const getPageTitle = (cancellationFlow, error) => {
  if (error) {
    return 'We couldn’t verify your information';
  }
  if (cancellationFlow) {
    return 'Cancel VA Solid Start appointment';
  }
  return 'Schedule an appointment with VA Solid Start';
};

const EnterOTC = () => {
  const [searchParams] = useSearchParams();
  const cancellationFlow = searchParams.get('cancel') === 'true';
  const navigate = useNavigate();
  const obfuscatedEmail = useSelector(selectObfuscatedEmail);

  const [code, setCode] = useState('');
  const [error, setError] = useState(undefined);
  const [fieldError, setFieldError] = useState(undefined);
  const [focusTrigger, setFocusTrigger] = useState(0);

  const [postOTCVerification, { isLoading }] = usePostOTCVerificationMutation();

  useEffect(
    () => {
      if (fieldError || error) {
        setTimeout(() => {
          if (fieldError) {
            focusElement('va-text-input[name="otc"]');
          } else {
            focusElement('va-alert[data-testid="enter-otc-error-alert"]');
          }
        }, 100);
      }
    },
    [fieldError, error, focusTrigger],
  );

  const handleSubmit = async () => {
    if (code === '') {
      setFieldError('Please enter your one-time verification code');
      setFocusTrigger(prev => prev + 1);
      return;
    }
    const response = await postOTCVerification({
      otc: code,
    });

    if (response.error) {
      setError(response.error);
      setCode('');
      setFocusTrigger(prev => prev + 1);
      return;
    }
    if (cancellationFlow) {
      // TODO: handle cancellation flow
      navigate(`${URLS.CANCEL_APPOINTMENT}/abcdef123456`, { replace: true });
    } else {
      navigate(URLS.DATE_TIME, { replace: true });
    }
  };

  const errorMessage = getErrorMessage(error?.code, error?.attemptsRemaining);
  const pageTitle = getPageTitle(
    cancellationFlow,
    error?.code === 'account_locked',
  );

  const verificationError =
    error?.code === 'account_locked' ? errorMessage : undefined;

  return (
    <Wrapper pageTitle={pageTitle} verificationError={verificationError}>
      {!error?.code && (
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

      {error?.code && (
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
            setFieldError(undefined);
          }
        }}
        onInput={e => {
          setCode(e.target.value);
        }}
        required
        error={fieldError}
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
