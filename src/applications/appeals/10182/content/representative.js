import React from 'react';

export const RepIntroTitle = (
  <div>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
      Do you have a Veterans Service Organization or accredited representative
      helping you file this decision review?
    </p>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--1 hide-on-review">
      <strong>Note:</strong> An accredited representative is a professional,
      like an attorney, a claims agent, or a Veterans Service Officer, who is
      trained and certified in the VA claims and appeals processes.
    </p>
  </div>
);

export const repLabel = 'Representative or VSO name';

// keep <div> because css removes margin for .schemaform-block-header > p
export const repDescription = (
  <div>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--3">
      Enter the name of the accredited representative or Veterans Service
      Organization (VSO) you’re working with (use the name you provided on Form
      21-22 or Form 21-22a).
    </p>
  </div>
);

export const repErrorMessage =
  'Please enter your representative or VSO information';
