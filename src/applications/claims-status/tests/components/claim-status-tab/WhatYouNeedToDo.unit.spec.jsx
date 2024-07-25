import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import WhatYouNeedToDo from '../../../components/claim-status-tab/WhatYouNeedToDo';
import { renderWithRouter } from '../../utils';

const nothingNeededText =
  'There’s nothing we need from you right now. We’ll let you know when there’s an update.';

describe('<WhatYouNeedToDo>', () => {
  const getStore = (cst5103UpdateEnabled = false) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_5103_update_enabled: cst5103UpdateEnabled,
      },
    }));
  context('when cst5103UpdateEnabled is false', () => {
    it('should render no-documents description when there are no tracked items or standard 5103', () => {
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

      const { container, getByText } = render(
        <Provider store={getStore()}>
          <WhatYouNeedToDo claim={claim} />
        </Provider>,
      );

      getByText(nothingNeededText);
      expect($('va-alert', container)).not.to.exist;
    });

    it('shows va-alert when there is a tracked item', () => {
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
        <Provider store={getStore()}>
          <WhatYouNeedToDo claim={claim} />
        </Provider>,
      );

      expect(queryByText(nothingNeededText)).not.to.exist;
      expect($('va-alert', container)).to.exist;
    });

    context(
      'when claim has a tracked item with an automated 5103 and a standard 5103',
      () => {
        it('shows va-alert for automated 5103 notice', () => {
          const claim = {
            id: 1,
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

          const {
            container,
            getByText,
            queryByText,
            getByTestId,
            queryByTestId,
          } = renderWithRouter(
            <Provider store={getStore()}>
              <WhatYouNeedToDo claim={claim} />
            </Provider>,
          );

          expect(queryByText(nothingNeededText)).not.to.exist;
          expect($('va-alert', container)).to.exist;
          expect(getByTestId(`item-${claim.attributes.trackedItems[0].id}`)).to
            .exist;
          getByText('Automated 5103 Notice Response');
          expect(queryByTestId('standard-5103-notice-alert')).to.not.exist;
          expect(queryByText('5103 Evidence Notice')).to.be.null;
        });
      },
    );
  });

  context('when cst5103UpdateEnabled is false', () => {
    it('should render no-documents description when there are no tracked items or standard 5103', () => {
      const claim = {
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
        },
      };

      const { container, getByText } = render(
        <Provider store={getStore(true)}>
          <WhatYouNeedToDo claim={claim} />
        </Provider>,
      );

      getByText(nothingNeededText);
      expect($('va-alert', container)).not.to.exist;
    });

    it('shows standard 5103 alert when are no tracked items and there is a standard 5103', () => {
      const claim = {
        id: 1222,
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

      const {
        container,
        queryByText,
        getByTestId,
        getByText,
      } = renderWithRouter(
        <Provider store={getStore(true)}>
          <WhatYouNeedToDo claim={claim} />
        </Provider>,
      );

      expect(queryByText(nothingNeededText)).not.to.exist;
      expect($('va-alert', container)).to.exist;
      expect(getByTestId('standard-5103-notice-alert')).to.exist;
      getByText('5103 Evidence Notice');
      expect(queryByText('Automated 5103 Notice Response')).to.be.null;
    });

    it('shows va-alert when there is a tracked item', () => {
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
        <Provider store={getStore(true)}>
          <WhatYouNeedToDo claim={claim} />
        </Provider>,
      );

      expect(queryByText(nothingNeededText)).not.to.exist;
      expect($('va-alert', container)).to.exist;
    });

    context(
      'when claim has a tracked item with an automated 5103 and a standard 5103',
      () => {
        it('shows va-alert for automated 5103 notice when files are needed', () => {
          const claim = {
            id: 1,
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

          const {
            container,
            getByText,
            queryByText,
            getByTestId,
            queryByTestId,
          } = renderWithRouter(
            <Provider store={getStore(true)}>
              <WhatYouNeedToDo claim={claim} />
            </Provider>,
          );

          expect(queryByText(nothingNeededText)).not.to.exist;
          expect($('va-alert', container)).to.exist;
          expect(getByTestId(`item-${claim.attributes.trackedItems[0].id}`)).to
            .exist;
          getByText('Automated 5103 Notice Response');
          expect(queryByTestId('standard-5103-notice-alert')).to.not.exist;
          expect(queryByText('5103 Evidence Notice')).to.be.null;
        });
      },
    );
  });
});
