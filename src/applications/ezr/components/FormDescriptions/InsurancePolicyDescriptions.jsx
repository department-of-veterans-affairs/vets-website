import React from 'react';

export const InsurancePolicyOrDescription = (
  <div className="vads-u-margin-y--3 vads-u-font-weight--bold">Or</div>
);

export const PolicyOrGroupDescription = (
  <div className="vads-u-margin-top--6 vads-u-margin-bottom--2 vads-u-color--base vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--bold">
    Provide either your insurance policy number or group code.{' '}
    <span className="schemaform-required-span vads-u-font-family--sans vads-u-font-size--base vads-u-font-weight--normal">
      (*Required)
    </span>
  </div>
);

export const TricarePolicyDescription = (
  <va-additional-info trigger="I have TRICARE. What’s my policy number?">
    <div>
      <p className="vads-u-margin-top--0">
        You can use your Department of Defense benefits number (DBN) or your
        Social Security number as your policy number.
      </p>
      <p className="vads-u-margin-bottom--0">
        Your DBN is an 11-digit number. You’ll find this number on the back of
        your military ID card.
      </p>
    </div>
  </va-additional-info>
);
