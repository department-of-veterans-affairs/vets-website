import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { focusElement } from 'platform/utilities/ui';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';

// TODO: remove this and use mock data from the API
const mockUsers = [
  {
    uuid: 'c0ffee-1234-beef-5678',
    lastname: 'Smith',
    dob: '1935-04-07',
    otc: '123456',
  },
];

const Verify = () => {
  const navigate = useNavigate();

  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState('');

  const [error, setError] = useState(false);
  const [lastnameError, setLastnameError] = useState(undefined);
  const [dobError, setDobError] = useState(undefined);
  const [attemptCount, setAttemptCount] = useState(1);
  const [verificationError, setVerificationError] = useState(undefined);
  const [focusTrigger, setFocusTrigger] = useState(0);

  useEffect(
    () => {
      if (error || lastnameError || dobError) {
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
    [focusTrigger, error, lastnameError, dobError],
  );

  const handleSubmit = () => {
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
    // TODO: remove this and use the fetch call to the API
    const mockUser = mockUsers.find(
      user => user.lastname === lastname && user.dob === dob,
    );
    // confirm auth here
    if (mockUser) {
      setError(false);
      navigate('/enter-otc');
    } else {
      if (attemptCount === 3) {
        setVerificationError(
          'We’re sorry. We couldn’t match your information to your records. Please call us for help.',
        );
      } else {
        setError(true);
      }
      setAttemptCount(count => count + 1);
    }
  };

  return (
    <Wrapper
      pageTitle={
        !verificationError
          ? 'Schedule a call to learn about VA benefits and health care'
          : "We couldn't verify your information"
      }
      verificationError={verificationError}
    >
      <p data-testid="verify-intro-text">
        First, we’ll need your information so we can send you a one-time
        verification code to verify your identity.
      </p>
      {error && (
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
        onKeyDown={() => {}}
        monthSelect={false}
      />
      <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container vass-flex-direction--column">
        <va-button
          data-testid="submit-button"
          big
          onClick={handleSubmit}
          text="Submit"
          uswds
        />
      </div>
    </Wrapper>
  );
};

export default Verify;
