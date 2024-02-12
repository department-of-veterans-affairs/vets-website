import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { buildDateFormatter } from '../../utils/helpers';

import ClaimStatusHeader from '../../components/ClaimStatusHeader';

const formatDate = date => buildDateFormatter('MMMM d, yyyy')(date);

const getLastUpdated = claim => {
  const updatedOn = formatDate(
    claim.attributes.claimPhaseDates?.phaseChangeDate,
  );

  return `Last updated: ${updatedOn}`;
};

describe('<ClaimStatusHeader>', () => {
  it('should render a ClaimStatusHeader section for an In Progress claim', () => {
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
    const { container, getByText } = render(
      <ClaimStatusHeader claim={claim} />,
    );
    expect($('.claim-status-header-container', container)).to.exist;
    expect($('.usa-label', container)).to.exist;
    expect(getByText('In Progress')).to.exist;
    expect(getByText(getLastUpdated(claim))).to.exist;
  });

  it('should render a ClaimStatusHeader section for a Complete claim', () => {
    const claim = {
      id: '1',
      attributes: {
        supportingDocuments: [],
        claimDate: '2023-01-01',
        closeDate: '2023-01-10',
        documentsNeeded: true,
        decisionLetterSent: false,
        status: 'COMPLETE',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-01-10',
          latestPhaseType: 'Complete',
          previousPhases: {
            phase1CompleteDate: 'null',
          },
        },
      },
    };
    const { container, getByText } = render(
      <ClaimStatusHeader claim={claim} />,
    );
    expect($('.claim-status-header-container', container)).to.exist;
    expect($('.usa-label', container)).to.not.exist;
    expect(getByText(getLastUpdated(claim))).to.exist;
  });
});
