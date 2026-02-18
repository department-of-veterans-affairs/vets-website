import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import { useDispatch } from 'react-redux';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';
import { usePostAuthenticationMutation } from '../redux/api/vassApi';
import { clearFormData, setFlowType } from '../redux/slices/formSlice';
import { FLOW_TYPES, URLS } from '../utils/constants';
import { useErrorFocus } from '../hooks/useErrorFocus';
import {
  isInvalidCredentialsError,
  isRateLimitExceededError,
  isServerError,
} from '../utils/errors';

const getPageTitle = (cancellationFlow, verificationError) => {
  if (verificationError) {
    return 'We couldn’t verify your information';
  }
  if (cancellationFlow) {
    return 'Cancel VA Solid Start appointment';
  }
  return 'Schedule an appointment with VA Solid Start';
};

const Verify = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Check for cancel=true URL parameter to initiate cancellation flow
  const cancellationFlow = searchParams.get('cancel') === 'true';
  const uuid = searchParams.get('uuid');

  // Ensures a fresh start when landing on Verify page and sets the flow type
  useEffect(
    () => {
      dispatch(clearFormData());
      // Set flow type based on URL parameter
      const flowType = cancellationFlow
        ? FLOW_TYPES.CANCEL
        : FLOW_TYPES.SCHEDULE;
      dispatch(setFlowType(flowType));
    },
    [dispatch, cancellationFlow],
  );

  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');

  const [
    postAuthentication,
    { isLoading, error: postAuthenticationError },
  ] = usePostAuthenticationMutation();

  const [
    { error: lastNameError, handleSetError: setLastNameError },
    { error: dobError, handleSetError: setDobError },
    { handleSetError: setAuthError },
  ] = useErrorFocus([
    'va-text-input[data-testid="last-name-input"]',
    'va-memorable-date[data-testid="dob-input"]',
    'va-alert[data-testid="verify-error-alert"]',
  ]);

  const [attemptCount, setAttemptCount] = useState(1);
  const [verificationError, setVerificationError] = useState(undefined);

  const handleSubmit = async () => {
    if (lastName === '' || dob === '') {
      if (lastName === '') {
        setLastNameError('Please enter your last name');
      }
      if (dob === '') {
        setDobError('Please enter your date of birth');
      }
      return;
    }
    const response = await postAuthentication({
      uuid,
      lastName,
      dob,
    });
    if (response.error) {
      setAuthError('error');
      if (attemptCount === 3 || isRateLimitExceededError(response.error)) {
        setVerificationError(
          'We’re sorry. We couldn’t match your information to your records. Please call us for help.',
        );
      }
      setAttemptCount(count => count + 1);
      return;
    }
    navigate(URLS.ENTER_OTP);
  };

  const pageTitle = getPageTitle(cancellationFlow, verificationError);

  return (
    <Wrapper
      errorAlert={!uuid || isServerError(postAuthenticationError)}
      pageTitle={pageTitle}
      verificationError={verificationError}
    >
      <p data-testid="verify-intro-text">
        First, we’ll need your information so we can send you a one-time
        verification code to verify your identity.
      </p>
      {isInvalidCredentialsError(postAuthenticationError) && (
        <div className="vads-u-margin-bottom--2">
          <va-alert data-testid="verify-error-alert" status="error">
            We’re sorry. We couldn’t find a record that matches that last name
            or date of birth. Please try again.
          </va-alert>
        </div>
      )}
      <va-text-input
        data-testid="last-name-input"
        label="Your last name"
        value={lastName}
        name="last-name"
        onBlur={e => {
          // Clear the error if the user has entered a value
          if (e.target.value !== '') {
            setLastNameError('');
          }
        }}
        onInput={e => {
          setLastName(e.target.value);
        }}
        required
        error={lastNameError}
        show-input-error
      />
      <VaMemorableDate
        id="dob-input"
        data-testid="dob-input"
        label="Date of birth"
        value={dob}
        onDateBlur={e => {
          // Clear the error if the user has entered a value
          if (e.target.value !== '') {
            setDobError('');
          }
        }}
        onDateChange={e => {
          setDob(e.target.value);
        }}
        name="date-of-birth"
        error={dobError}
        required
        monthSelect={false}
      />
      <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container vass-flex-direction--column">
        <va-button
          data-testid="submit-button"
          big
          disabled={isLoading || verificationError}
          onClick={handleSubmit}
          text="Submit"
          uswds
          loading={isLoading}
        />
      </div>
    </Wrapper>
  );
};

export default Verify;
