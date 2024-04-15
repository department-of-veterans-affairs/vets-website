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

  summaryTitle: 'Review the evidence you’re submitting',

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

  // remove messages
  removeEvidence: {
    title: 'Are you sure you want to remove this evidence?',
    limitationTitle: 'Are you sure you want to remove the request limitation?',
    va: 'We’ll remove the VA medical record request for',
    private: 'We’ll remove the private medical record request for',
    limitation: '',
    upload: 'We’ll remove the uploaded document',
    modalRemove: 'Yes, remove this',
    modalNotRemove: 'No, keep this',
    modalRemoveLimitation: 'Yes, remove limitation',
    modalNotRemoveLimitation: 'No, keep limitation',
  },

  // error messages
  missing: {
    location: (
      <span className="usa-input-error-message">Missing location name</span>
    ),
    facility: (
      <span className="usa-input-error-message">Missing provider name</span>
    ),
    condition: (
      <span className="usa-input-error-message">Missing condition</span>
    ),
    dates: (
      <span className="usa-input-error-message">Missing treatment dates</span>
    ),
    from: (
      <span className="usa-input-error-message vads-u-display--inline-block">
        Missing start date
      </span>
    ),
    to: (
      <span className="usa-input-error-message vads-u-display--inline-block">
        Missing end date
      </span>
    ),
    address: (
      <span className="usa-input-error-message">Incomplete address</span>
    ),

    attachmentId: (
      <span className="usa-input-error-message">Missing document type</span>
    ),
  },

  missingEvidenceHeader: 'We noticed you didn’t add new evidence',
  missingEvidenceText: (
    <>
      <p>
        If you’re filing a claim based on new evidence, we encourage you to
        submit the evidence with your claim. But if you don’t have the evidence
        now, you can still file your claim. We’ll work with you to get the
        evidence.
      </p>
      <p>
        <strong>Note:</strong> If you have a presumptive condition, you don’t
        need to submit evidence to prove a service connection.
      </p>
    </>
  ),
  missingEvidenceReviewText: 'I didn’t add any evidence',
};
