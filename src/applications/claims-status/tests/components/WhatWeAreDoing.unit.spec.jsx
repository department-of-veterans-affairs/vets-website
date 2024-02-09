import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import WhatWeAreDoing from '../../components/WhatWeAreDoing';

const statusMap = {
  CLAIM_RECEIVED: 'Step 1 of 5: Claim received',
  INITIAL_REVIEW: 'Step 2 of 5: Initial review',
  EVIDENCE_GATHERING_REVIEW_DECISION:
    'Step 3 of 5: Evidence gathering, review, and decision',
  PREPARATION_FOR_NOTIFICATION: 'Step 4 of 5: Preparation for notification',
  COMPLETE: 'Step 5 of 5: Closed',
};

function getStatusDescription(status) {
  return statusMap[status];
}

describe('<WhatWeAreDoing>', () => {
  it('should render a WhatWereDoing section', () => {
    const claim = {
      id: '1',
      attributes: {
        supportingDocuments: [],
        claimDate: '2023-01-01',
        closeDate: null,
        documentsNeeded: true,
        decisionLetterSent: false,
        status: 'INITIAL_REVIEW',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2015-01-01',
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
            phase2CompleteDate: '2023-02-08',
          },
        },
      },
    };
    const { container, getByText } = render(<WhatWeAreDoing claim={claim} />);
    expect($('.what-were-doing-container', container)).to.exist;
    getByText(getStatusDescription(claim.attributes.status));
  });
});
