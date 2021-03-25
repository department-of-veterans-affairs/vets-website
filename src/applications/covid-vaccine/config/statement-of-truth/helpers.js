import React from 'react';

const statementOfTruth = (
  <>
    My answer to this question is true and correct to the best of my knowledge
    and belief. I understand that it's a crime to give false information that
    could affect my eligibility to get a vaccine through VA. Penalties may
    include a fine, imprisonment, or both.
  </>
);

export const statementOfTruthVeteran = (
  <>
    <p>I certify that I am a Veteran. {statementOfTruth}</p>
  </>
);
export const statementOfTruthSpouse = (
  <>
    <p>I certify that I am the spouse of a Veteran. {statementOfTruth}</p>
  </>
);
export const statementOfTruthCaregiver = (
  <>
    <p>
      I certify that I am an eligible caregiver for a Veteran.{' '}
      {statementOfTruth}
    </p>
  </>
);
export const statementOfTruthChampva = (
  <>
    <p>I certify that I am a recipient of CHAMPVA. {statementOfTruth}</p>
  </>
);
