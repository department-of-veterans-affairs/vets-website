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

  missingEvidenceHeader: 'You haven’t added any evidence',
  missingEvidenceText:
    'You must provide at least one type of evidence to file for a Supplemental Claim',

  reviewPageHeaderText: 'Supporting evidence',
};
