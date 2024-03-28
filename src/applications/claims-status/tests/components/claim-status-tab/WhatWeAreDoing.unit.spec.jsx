import React from 'react';

import {
  getStatusDescription,
  getClaimStatusDescription,
} from '../../../utils/helpers';
import { renderWithRouter } from '../../utils';

import WhatWeAreDoing from '../../../components/claim-status-tab/WhatWeAreDoing';

const claim = {
  id: '1',
  attributes: {
    claimDate: '2023-01-01',
    claimPhaseDates: {
      currentPhaseBack: false,
      phaseChangeDate: '2023-02-08',
      latestPhaseType: 'UNDER_REVIEW',
      previousPhases: {
        phase1CompleteDate: '2023-02-08',
      },
    },
    closeDate: null,
    documentsNeeded: true,
    decisionLetterSent: false,
    status: 'INITIAL_REVIEW',
    supportingDocuments: [],
  },
};

describe('<WhatWeAreDoing>', () => {
  it('should render a WhatWereDoing section', () => {
    const screen = renderWithRouter(<WhatWeAreDoing claim={claim} />);

    screen.getByText(getStatusDescription(claim.attributes.status));
    screen.getByText(getClaimStatusDescription(claim.attributes.status));
  });
});
