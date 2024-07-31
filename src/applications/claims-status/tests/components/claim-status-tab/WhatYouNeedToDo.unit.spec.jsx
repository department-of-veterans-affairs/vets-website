import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import WhatYouNeedToDo from '../../../components/claim-status-tab/WhatYouNeedToDo';
import { renderWithRouter } from '../../utils';

const nothingNeededText =
  'There’s nothing we need from you right now. We’ll let you know when there’s an update.';

describe('<WhatYouNeedToDo>', () => {
  it('should render no-documents description when there are no files needed', () => {
    const claim = {
      attributes: {
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        closeDate: null,
        evidenceWaiverSubmitted5103: false,
        claimPhaseDates: {
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
          previousPhases: {
            phase1CompleteDate: '2024-01-17',
            phase2CompleteDate: '2024-01-18',
          },
        },
      },
    };

    const { container, getByText } = render(<WhatYouNeedToDo claim={claim} />);

    getByText(nothingNeededText);
    expect($('va-alert', container)).not.to.exist;
  });

  it('shouldn’t indicate that nothing is needed when files are needed', () => {
    const claim = {
      id: 1,
      status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
      closeDate: null,
      evidenceWaiverSubmitted5103: false,
      attributes: {
        claimPhaseDates: {
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
          previousPhases: {
            phase1CompleteDate: '2024-01-17',
            phase2CompleteDate: '2024-01-18',
          },
        },
        trackedItems: [
          {
            id: 123,
            status: 'NEEDED_FROM_YOU',
          },
        ],
      },
    };

    const { container, queryByText } = renderWithRouter(
      <WhatYouNeedToDo claim={claim} />,
    );

    expect(queryByText(nothingNeededText)).not.to.exist;
    expect($('va-alert', container)).to.exist;
  });

  context(
    'when claim has a tracked item with an automated 5103 and evidenceWaiverSubmitted5103 true',
    () => {
      it('should render no-documents description', () => {
        const claim = {
          id: 1,
          attributes: {
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
            closeDate: null,
            evidenceWaiverSubmitted5103: true,
            claimPhaseDates: {
              latestPhaseType: 'GATHERING_OF_EVIDENCE',
              previousPhases: {
                phase1CompleteDate: '2024-01-17',
                phase2CompleteDate: '2024-01-18',
              },
            },
            trackedItems: [
              {
                description: 'Automated 5103 Notice Response',
                displayName: 'Automated 5103 Notice Response',
                id: 467558,
                overdue: true,
                requestedDate: '2024-01-19',
                status: 'NEEDED_FROM_YOU',
                suspenseDate: '2024-03-07',
                uploadsAllowed: true,
              },
            ],
          },
        };

        const { container, queryByText } = renderWithRouter(
          <WhatYouNeedToDo claim={claim} />,
        );

        expect(queryByText(nothingNeededText)).to.exist;
        expect($('va-alert', container)).to.not.exist;
      });
    },
  );
});
