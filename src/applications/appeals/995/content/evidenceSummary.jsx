import React from 'react';
import { Link } from 'react-router';

import { EVIDENCE_VA_REQUEST } from '../constants';

export const content = {
  edit: 'Edit',
  remove: 'Remove',
  update: 'Update page',

  vaTitle: 'You’re requesting records from these VA locations:',
  vaReviewTitle: 'VA medical records',

  privateTitle: 'You’re requesting records from these private providers:',
  privateReviewTitle: 'Private medical records',

  otherTitle: 'You uploaded these documents:',
  otherReviewTitle: 'Supporting (lay) statements or other evidence',

  addMoreLink: (
    <p>
      <Link
        to={`/${EVIDENCE_VA_REQUEST}`}
        className="vads-c-action-link--green"
      >
        Add more evidence
      </Link>
    </p>
  ),

  missingEvidence: (
    <va-alert id="no-evidence" status="error">
      <h2 slot="headline">You haven’t added any evidence</h2>
      You must provide at least one type of evidence to file for a Supplemental
      Claim
    </va-alert>
  ),

  reviewPageHeaderText: 'Supporting evidence',
};
