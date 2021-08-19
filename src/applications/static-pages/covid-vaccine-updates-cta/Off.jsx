import React from 'react';
import AlertBox, {
  ALERT_TYPE,
} from '@department-of-veterans-affairs/component-library/AlertBox';

export default function OffState() {
  return (
    <AlertBox
      status={ALERT_TYPE.INFO}
      headline="Check back soon for an easy way to stay informed and help us prepare"
      content={
        <>
          <p>
            We're creating an easy way for you to sign up to stay informed about
            our COVID-19 vaccine plans.
          </p>
          <p>
            When you sign up, we’ll also ask about your interest in getting a
            vaccine when one is available to you. By sharing your interest, you
            can help us better prepare as we work to offer vaccines to more
            Veterans.
          </p>
          <p>
            <strong>Note:</strong> You don't need to sign up to get a vaccine.
          </p>
        </>
      }
    />
  );
}
