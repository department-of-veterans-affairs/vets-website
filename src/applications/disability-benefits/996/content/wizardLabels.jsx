import React from 'react';

import { FORM_URL } from '../constants';

export const wizardButtonText = 'Start the Higher-Level Review request';

export const wizardLabels = {
  compensation: 'A disability compensation claim',
  other: 'A benefit claim other than compensation',
  no: 'No',
  yes: 'Yes',
};

export const claimDescription = `What type of claim are you requesting for a
  Higher-Level Review?`;

export const legacyDescription = (
  <p>
    Are any of the decisions you would like to request a Higher-Level Review for
    currently in the <a href="/disability/file-an-appeal/">legacy appeals</a>{' '}
    process?
  </p>
);

export const startPageText = 'Request a Higher-Level Review';

export const alertHeading = `You’ll need to submit a paper form to request a
  Higher-Level Review`;

export const AlertOtherTypeContent = (
  <>
    <p>
      We’re sorry. You can only request a Higher-Level Review online for
      compensation claims right now.
    </p>
    <p>
      To request a Higher-Level Review for another benefit type, please fill out
      a Decision Review Request: Higher-Level Review (VA Form 20-0996).
    </p>
    <a href={FORM_URL}>Download VA Form 20-0996 (PDF)</a>
  </>
);

export const AlertLegacyContent = (
  <>
    <p>
      If you have a decision date before Februrary 19, 2019 and received a
      Statement of the Case (SOC) or Supplemental Statement of the Case (SSOC)
      because you had filed an appeal under the old (or former) appeals system,
      you’ll have to opt-in to the new decision review process via a submitted
      paper form.
    </p>
    <p>
      To opt in, please fill out a Decision Review Request: Higher-Level Review
      (VA Form 20-0996) and check “opt-in from SOC/SSOC” in box 15 of the paper
      form.
    </p>
    <a href={FORM_URL}>Download VA Form 20-0996 (PDF)</a>
    <p>
      If you had not filed a legacy appeal within a year of the decision dated
      before Februrary 19, 2019, you will need to{' '}
      <a href="/decision-reviews/supplemental-claim/">
        file a Supplemental Claim
      </a>
      .
    </p>
  </>
);
