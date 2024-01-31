import React from 'react';

export const benefitDescription = (
  <p>
    If you have certain service-connected conditions or disabilities, you may be
    eligible for help buying a specially equipped vehicle or modifying your car
    or home to make it more accessible. Typically, you can receive the
    automobile allowance only once in your lifetime.
  </p>
);

const doubleAllowanceAlertContent = (
  <>
    <p className="vads-u-font-size--base vads-u-margin-top--0">
      Typically, you can receive the automobile allowance only once in your
      lifetime. You may be eligible for a second automobile allowance in the
      following situations:
    </p>
    <ul className="vads-u-font-size--base">
      <li>
        Your first adapted vehicle was destroyed as a result of a natural
        catastrophe, <strong>or</strong>
      </li>
      <li>Your first adapted vehicle was destroyed and it wasn’t your fault</li>
    </ul>
    <p className="vads-u-font-size--base vads-u-padding-left--2">
      <strong>and</strong>
    </p>
    <ul className="vads-u-font-size--base">
      <li>
        You didn’t receive compensation for the vehicle’s loss from a property
        insurer
      </li>
    </ul>
  </>
);

export const doubleAllowanceAlert = (
  <va-alert status="warning" uswds>
    {doubleAllowanceAlertContent}
  </va-alert>
);
