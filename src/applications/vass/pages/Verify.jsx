import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import { VaMemorableDate } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import Wrapper from '../layout/Wrapper';

const Verify = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // confirm auth here
    navigate('/enter-otc');
  };
  return (
    <Wrapper pageTitle="Schedule a call to learn about VA benefits and health care">
      <p data-testid="verify-intro-text">
        First, we’ll need your information so we can send you a one-time
        verification code to verify your identity.
      </p>
      <va-text-input
        data-testid="last-name-input"
        label="Your last name"
        name="last-name"
        onBlur={() => {}}
        onInput={() => {}}
        required
        show-input-error
      />
      <VaMemorableDate
        id="dob-input"
        data-testid="dob-input"
        label="Date of birth"
        onDateBlur={() => {}}
        onDateChange={() => {}}
        name="date-of-birth"
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
