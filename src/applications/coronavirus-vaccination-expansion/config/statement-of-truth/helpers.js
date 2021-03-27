import React from 'react';

const statementOfTruth = (
  <>
    that the information I provide in this form is true and correct to the best
    of my knowledge and belief.
  </>
);

export const ifYouAgree = (
  <>
    <p>
      It's a crime to provide information that you know is untrue or incorrect.
      Doing so could result in a fine or other penalty. If you understand and
      agree with the following statement, please check the box:
    </p>
    <p className="vads-u-color--secondary">(*Required)</p>
  </>
);

export const statementOfTruthVeteran = (
  <>
    <p>I certify that I am a Veteran and {statementOfTruth}</p>
  </>
);
export const statementOfTruthSpouse = (
  <>
    <p>I certify that I am the spouse of a Veteran and {statementOfTruth}</p>
  </>
);
export const statementOfTruthCaregiver = (
  <>
    <p>
      I certify that I am an eligible caregiver for a Veteran and{' '}
      {statementOfTruth}
    </p>
  </>
);
export const statementOfTruthChampva = (
  <>
    <p>
      I certify that I am a recipient of CHAMPVA benefits and {statementOfTruth}
    </p>
  </>
);
