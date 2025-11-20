import React from 'react';
import { useNavigate } from 'react-router-dom-v5-compat';
import Wrapper from '../layout/Wrapper';

const EnterOTC = () => {
  const navigate = useNavigate();
  // TODO: get veteran email from lorota?
  const veteranEmail = 'test@test.com';

  const handleSubmit = () => {
    // confirm otc code here
    navigate('/date-time');
  };
  return (
    <Wrapper pageTitle="Schedule a call to learn about VA benefits and health care">
      <va-alert status="success" visible>
        <p className="vads-u-margin-y--0">
          {`We just emailed a one-time verification code to ${veteranEmail}.
          Please check your email and come back to enter the code to complete
          your verification process and start scheduling your appointment.`}
        </p>
      </va-alert>
      <va-text-input
        label="Enter your one-time verification code"
        name="otc"
        onBlur={() => {}}
        onInput={() => {}}
        required
        show-input-error
      />
      <div className="vads-u-display--flex vads-u-margin-top--4 vass-form__button-container vass-flex-direction--column">
        <va-button big onClick={handleSubmit} text="Continue" uswds />
      </div>
    </Wrapper>
  );
};

export default EnterOTC;
