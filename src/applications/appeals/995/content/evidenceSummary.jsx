import React from 'react';
import { Link } from 'react-router';

import recordEvent from 'platform/monitoring/record-event';

import { EVIDENCE_VA_REQUEST } from '../constants';

import { isOnReviewPage } from '../../shared/utils/helpers';

const recordActionLinkClick = () => {
  recordEvent({
    event: 'cta-action-link-click',
    'action-link-type': 'primary',
    'action-link-click-label': 'Add more evidence',
    'action-link-icon-color': 'green',
  });
};

const wrapError = (message, block) => (
  <span
    className={`usa-input-error-message${
      block ? ' vads-u-display--inline-block' : ''
    }`}
  >
    {message}
  </span>
);

export const content = {
  edit: 'Edit',
  editLinkAria: 'Edit document type for',
  editLabel: 'Edit evidence summary page',
  remove: 'Remove', // for locations
  delete: 'Delete', // for files
  update: 'Update page',
  noDate: 'No date provided',

  summaryTitle: 'Review the evidence you’re submitting',

  vaTitle: 'We’re requesting records from these VA locations:',

  privateTitle: 'We’re requesting records from these non-VA medical providers:',

  otherTitle: 'You uploaded these documents:',

  addMoreLink: () => {
    const Header = isOnReviewPage() ? 'h5' : 'h4';
    return (
      <>
        <Header className="sr-only">Are you missing evidence?</Header>
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
    );
  },

  // remove messages
  removeEvidence: {
    title: 'Are you sure you want to remove this evidence?',
    limitationTitle: 'Are you sure you want to remove the request limitation?',
    va: 'We’ll remove the VA medical record request for',
    private: 'We’ll remove the non-VA medical record request for',
    limitation: '',
    upload: 'We’ll remove the uploaded document',
    modalRemove: 'Yes, remove this',
    modalDelete: 'Yes, delete this file',
    modalNotRemove: 'No, keep this',
    modalRemoveLimitation: 'Yes, remove limitation',
    modalNotRemoveLimitation: 'No, keep limitation',
  },

  // error messages
  missing: {
    location: wrapError('Missing location name'),
    facility: wrapError('Missing provider name'),
    condition: wrapError('Missing condition'),
    date: wrapError('Missing treatment date'),
    dates: wrapError('Missing treatment dates'),
    from: wrapError('Missing start date', true),
    to: wrapError('Missing end date', true),
    address: wrapError('Incomplete address'),
    attachmentId: wrapError('Missing document type'),
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
