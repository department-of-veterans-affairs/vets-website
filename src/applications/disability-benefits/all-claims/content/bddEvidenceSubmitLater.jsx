import React from 'react';
import { DBQ_URL } from '../constants';

const alertContent = (
  <p className="vads-u-font-size--base">
    You’ll need to submit your completed{' '}
    <a href={DBQ_URL} target="_blank" rel="noreferrer">
      Separation Health Assessment - Part A Self-Assessment (opens in new tab)
    </a>{' '}
    so we can request your VA exams. You can submit this form on VA.gov after
    you file your BDD claim.
  </p>
);

export const BddEvidenceSubmitLater = () => {
  return (
    <va-alert id="submit-evidence-later" status="warning" uswds>
      <h3 slot="headline">
        Submit your Separation Health Assessment - Part A Self-Assessment as
        soon as you can
      </h3>
      {alertContent}
    </va-alert>
  );
};
