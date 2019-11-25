import React from 'react';

import { BASE_URL } from '../constants';

export const wizardButtonText = 'Start the Higher-Level Review request';

export const wizardDescription = `What type of claim are you requesting for a
  Higher-Level Review?`;

export const wizardLabels = {
  disability: 'Disability compensation claim',
  pension: 'Pension claim',
  other: 'A benefit claim other then compensation or pension',
};

export const startPageText = 'Request a Higher-Level Review';

export const startPageUrl = BASE_URL;

export const alertHeading = `You’ll need to submit a paper form to request a
  Higher-Level Review`;

export const AlertContent = (
  <>
    <p>
      We’re sorry. You can only request a Higher-Level Review online for
      compensation and pension claims right now.
    </p>
    <p>
      To request a Higher-Level Review for another benefit type, please fill out
      a Decision Review Request: Higher-Level Review (VA Form 20-0996).
    </p>
    <a href="https://staging.va.gov/decision-reviews/forms/higher-level-review-20-0996.pdf">
      Download VA Form 20-0996 (PDF)
    </a>
  </>
);
