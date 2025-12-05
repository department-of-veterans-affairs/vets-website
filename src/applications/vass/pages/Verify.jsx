import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
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

  const handleSubmit = () => {
    if (lastname === '' || dob === '') {
      if (lastname === '') {
        setLastnameError('Please enter your last name');
      }
      if (dob === '') {
        setDobError('Please enter your date of birth');
      }
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
      setError(true);
    }
  };

  return (
    <Wrapper pageTitle="Schedule a call to learn about VA benefits and health care">
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
