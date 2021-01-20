import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export const benefitDescription = (
  <p>
    We can help service members and Veterans with certain service-connected
    disabilities buy a specially equipped vehicle or modify their car or home to
    make it more accessible. Typically, you can receive the automobile allowance
    only once in your lifetime.
  </p>
);

const doubleAllowanceAlertContent = (
  <div>
    <p>
      Typically, you can receive the automobile allowance only once in your
      lifetime. You may be eligible for a second automobile allowance in the
      following situations:
    </p>
    <ul>
      <li>
        Your first adapted vehicle was destroyed as a result of a natural
        catastrophe, <strong>or</strong>
      </li>
      <li>Your first adapted vehicle was destroyed and it wasn’t your fault</li>
    </ul>
    <p style={{ paddingLeft: '2rem' }}>
      <strong>and</strong>
    </p>
    <ul>
      <li>
        You didn’t receive compensation for the vehicle’s loss from a property
        insurer
      </li>
    </ul>
  </div>
);

export const doubleAllowanceAlert = (
  <AlertBox status="warning" content={doubleAllowanceAlertContent} />
);
