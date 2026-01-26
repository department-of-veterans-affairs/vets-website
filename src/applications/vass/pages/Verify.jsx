import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom-v5-compat';
import { useDispatch } from 'react-redux';
import { focusElement } from 'platform/utilities/ui';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';
import { usePostAuthenticationMutation } from '../redux/api/vassApi';
import { clearFormData } from '../redux/slices/formSlice';
import { URLS } from '../utils/constants';

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
  if (!uuid) {
    // TODO: route to the "Something went wrong" page
  }

  // Ensures a fresh start when landing on Verify page
  useEffect(
    () => {
      dispatch(clearFormData());
    },
    [dispatch],
  );

  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState('');

  const [
    postAuthentication,
    { isLoading, error: postAuthenticationError },
  ] = usePostAuthenticationMutation();

  const [lastnameError, setLastnameError] = useState(undefined);
  const [dobError, setDobError] = useState(undefined);
  const [attemptCount, setAttemptCount] = useState(1);
  const [verificationError, setVerificationError] = useState(undefined);
  const [focusTrigger, setFocusTrigger] = useState(0);

  useEffect(
    () => {
      if (postAuthenticationError || lastnameError || dobError) {
        setTimeout(() => {
          if (lastnameError) {
            focusElement('va-text-input[data-testid="last-name-input"]');
          } else if (dobError) {
            focusElement('va-memorable-date[data-testid="dob-input"]');
          } else {
            focusElement('va-alert[data-testid="verify-error-alert"]');
          }
        }, 100);
      }
    },
    [focusTrigger, lastnameError, dobError, postAuthenticationError],
  );

  const handleSubmit = async () => {
    if (lastname === '' || dob === '') {
      if (lastname === '') {
        setLastnameError('Please enter your last name');
      }
      if (dob === '') {
        setDobError('Please enter your date of birth');
      }
      setFocusTrigger(prev => prev + 1);
      return;
    }
    const response = await postAuthentication({
      uuid,
      lastname,
      dob,
    });
    if (response.error) {
      setFocusTrigger(prev => prev + 1);
      if (attemptCount === 3 || response.error.code === 'rate_limit_exceeded') {
        setVerificationError(
          'We’re sorry. We couldn’t match your information to your records. Please call us for help.',
        );
      }
      setAttemptCount(count => count + 1);
      return;
    }
    let otcRoute = URLS.ENTER_OTC;
    if (cancellationFlow) {
      otcRoute += '?cancel=true';
    }
    navigate(otcRoute);
  };

  const pageTitle = getPageTitle(cancellationFlow, verificationError);

  return (
    <Wrapper pageTitle={pageTitle} verificationError={verificationError}>
      <p data-testid="verify-intro-text">
        First, we’ll need your information so we can send you a one-time
        verification code to verify your identity.
      </p>
      {postAuthenticationError && (
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
        value={lastname}
        name="last-name"
        onBlur={e => {
          // Clear the error if the user has entered a value
          if (e.target.value !== '') {
            setLastnameError(undefined);
          }
        }}
        onInput={e => {
          setLastname(e.target.value);
        }}
        required
        error={lastnameError}
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
            setDobError(undefined);
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
