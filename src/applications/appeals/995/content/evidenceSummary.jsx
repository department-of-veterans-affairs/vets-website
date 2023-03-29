import React from 'react';
import { Link } from 'react-router';

import recordEvent from 'platform/monitoring/record-event';

import { EVIDENCE_VA_REQUEST } from '../constants';

const recordActionLinkClick = () => {
  recordEvent({
    event: 'cta-action-link-click',
    'action-link-type': 'primary',
    'action-link-click-label': 'Add more evidence',
    'action-link-icon-color': 'green',
  });
};

export const content = {
  edit: 'Edit',
  editLinkAria: 'Edit document type for',
  editLabel: 'Edit evidence summary page',
  remove: 'Remove',
  update: 'Update page',

  summaryTitle: 'Confirm or edit your evidence',

  vaTitle: 'We’re requesting records from these VA locations:',

  privateTitle:
    'We’re requesting records from these private medical providers:',

  otherTitle: 'You uploaded these documents:',

  addMoreLink: (
    <>
      <h4 className="sr-only">Are you missing evidence?</h4>
      <p>
        <Link
          to={`/${EVIDENCE_VA_REQUEST}`}
          className="vads-c-action-link--green"
          onClick={recordActionLinkClick}
        >
          Add more evidence
        </Link>
      </p>
    </>
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
};
