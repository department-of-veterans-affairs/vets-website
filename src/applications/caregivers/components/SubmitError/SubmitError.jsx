import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

const SubmitError = () => {
  const ErrorBody = () => {
    return (
      <div>
        <h2>What you can do</h2>

        <p>
          If you feel you’ve entered your information correctly, please call the{' '}
          <a href="https://www.va.gov/">VA.gov</a> help desk at{' '}
          <a href="tel:8555747286">855-574-7286</a>
          (TTY: 711). We’re here Monday-Friday, 8:00 a.m.-8:00 p.m. ET.
        </p>

        <h3>
          You can also download a PDF version of this form and mail it to:
        </h3>

        <div>
          <span>Program of Comprehensive Assistance for Family Caregivers</span>
          <ul>
            <li>Health Eligibility Center</li>
            <li>2957 Clairmont Road NE, Ste 200</li>
            <li>Atlanta, GA 30329-1647</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <AlertBox
      headline="We can’t process your electronic application."
      content={ErrorBody()}
      status="error"
    />
  );
};

export default SubmitError;
