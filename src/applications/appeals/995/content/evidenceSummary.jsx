import React from 'react';
import { Link } from 'react-router';

import { EVIDENCE_VA_REQUEST } from '../constants';

export const content = {
  edit: 'Edit',
  editLabel: 'Edit evidence summary page',
  remove: 'Remove',
  update: 'Update page',

  vaTitle: 'We’re requesting records from these VA locations:',

  privateTitle:
    'We’re requesting records from these private medical providers:',

  otherTitle: 'You uploaded these documents:',

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

  missingEvidenceHeader: 'We noticed you didn’t add new evidence',
  missingEvidenceText: (
    <>
      <p>
        If you have a presumptive condition, you don’t need to submit new
        evidence with your claim. You can continue through this form.
      </p>
      <p>
        If you’re filing a claim based on new evidence, we encourage you to
        submit the evidence with your claim. But if you don’t have the evidence
        now, you can still file your claim. We’ll work with you to get the
        evidence.
      </p>
    </>
  ),
  missingEvidenceReviewText: 'I didn’t add any evidence',

  reviewPageHeaderText: 'New evidence',
};
