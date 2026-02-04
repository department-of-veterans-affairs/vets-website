import React from 'react';
import { within } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import RecentActivity from '../../../components/claim-status-tab/RecentActivity';
import { renderWithRouter } from '../../utils';

const getStore = (
  cstClaimPhasesEnabled = false,
  cstTimezoneDiscrepancyMitigation = true,
) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_claim_phases: cstClaimPhasesEnabled,
      // eslint-disable-next-line camelcase
      cst_timezone_discrepancy_mitigation: cstTimezoneDiscrepancyMitigation,
    },
  }));

const openClaimStep1 = {
  attributes: {
    claimDate: '2024-06-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-06-02',
      currentPhaseBack: false,
      latestPhaseType: 'CLAIM_RECEIVED',
      previousPhases: {},
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [],
  },
};

const openClaimStep3PhaseBack = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-06-22',
      currentPhaseBack: true,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-20',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [],
  },
};

const openClaimStep7 = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-06-22',
      currentPhaseBack: false,
      latestPhaseType: 'PREPARATION_FOR_NOTIFICATION',
      previousPhases: {
        phase1CompleteDate: '2024-05-20',
        phase2CompleteDate: '2024-05-22',
        phase3CompleteDate: '2019-07-05',
        phase4CompleteDate: '2024-06-11',
        phase5CompleteDate: '2024-06-12',
        phase6CompleteDate: '2024-06-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [],
  },
};

const closedClaimStep8 = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-06-22',
      currentPhaseBack: false,
      latestPhaseType: 'COMPLETE',
      previousPhases: {
        phase7CompleteDate: '2024-06-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    closeDate: '2024-06-22',
    trackedItems: [],
  },
};

const openClaimStep3WithNeededFromYouItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        requestedDate: '2024-05-12',
        status: 'NEEDED_FROM_YOU',
        displayName: 'Needed from you Request',
        friendlyName: 'friendly name',
      },
    ],
  },
};

const openClaimStep3WithNeededFromOthersItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        requestedDate: '2024-05-12',
        status: 'NEEDED_FROM_OTHERS',
        displayName: 'Needed from others Request',
        friendlyName: 'Third party friendly name',
      },
    ],
  },
};
const openClaimStep3WithDBQItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        requestedDate: '2024-05-12',
        status: 'NEEDED_FROM_OTHERS',
        displayName: 'DBQ AUDIO Hearing Loss and Tinnitus',
        friendlyName: 'DBQ friendly name',
      },
    ],
  },
};

const openClaimStep3WithNeededFromOthersItemwithActivityDescription = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        requestedDate: '2024-05-12',
        status: 'NEEDED_FROM_OTHERS',
        displayName: 'Needed from others Request',
        friendlyName: 'Third party friendly name',
        activityDescription: 'Activity Description',
      },
    ],
  },
};

const openClaimStep3WithDBQItemNoOverride = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        requestedDate: '2024-05-12',
        status: 'NEEDED_FROM_OTHERS',
        displayName: 'DBQ no override',
      },
    ],
  },
};

const openClaimStep3WithNoLongerRequiredItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        closedDate: '2024-05-12',
        status: 'NO_LONGER_REQUIRED',
        displayName: 'No longer required Request',
      },
    ],
  },
};

const openClaimStep3WithSubmittedAwaitingReviewItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        status: 'SUBMITTED_AWAITING_REVIEW',
        displayName: 'Submitted awaiting Request',
        documents: [
          {
            uploadDate: '2024-05-24',
          },
        ],
      },
    ],
  },
};

const openClaimStep3WithInitialReviewCompleteItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        receivedDate: '2024-05-12',
        status: 'INITIAL_REVIEW_COMPLETE',
        displayName: 'Initial review complete Request',
      },
    ],
  },
};

const openClaimStep3WithAcceptedItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        receivedDate: '2024-05-20',
        requestedDate: '2024-05-12',
        status: 'ACCEPTED',
        displayName: 'Accepted Request',
      },
    ],
  },
};

const openClaimStep4WithOver10Items = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-06-07',
      currentPhaseBack: false,
      latestPhaseType: 'REVIEW_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
        phase3CompleteDate: '2024-06-07',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        requestedDate: '2024-06-07',
        status: 'NEEDED_FROM_YOU',
        displayName: 'Needed from you Request',
      },
      {
        id: 2,
        requestedDate: '2024-06-07',
        status: 'NEEDED_FROM_YOU',
        displayName: 'Needed from you Request 2',
      },
      {
        id: 3,
        requestedDate: '2024-06-06',
        status: 'NEEDED_FROM_OTHERS',
        displayName: 'Needed from others Request',
      },
      {
        id: 4,
        requestedDate: '2024-06-05',
        status: 'NEEDED_FROM_OTHERS',
        displayName: 'Needed from others Request 2',
      },
      {
        id: 5,
        closedDate: '2024-05-24',
        requestedDate: '2024-05-20',
        status: 'NO_LONGER_REQUIRED',
        displayName: 'No longer required Request',
      },
      {
        id: 6,
        status: 'SUBMITTED_AWAITING_REVIEW',
        displayName: 'Submitted awaiting Request',
        documents: [
          {
            uploadDate: '2024-05-24',
          },
        ],
      },
      {
        id: 7,
        requestedDate: '2024-05-25',
        status: 'NEEDED_FROM_YOU',
        displayName: 'Needed from you Request 3',
      },
      {
        id: 8,
        receivedDate: '2024-05-27',
        status: 'INITIAL_REVIEW_COMPLETE',
        displayName: 'Initial review complete Request',
      },
      {
        id: 9,
        receivedDate: '2024-05-28',
        status: 'INITIAL_REVIEW_COMPLETE',
        displayName: 'Initial review complete Request',
      },
      {
        id: 10,
        requestedDate: '2024-05-29',
        status: 'ACCEPTED',
        displayName: 'Accepted Request',
      },
      {
        id: 11,
        requestedDate: '2024-05-28',
        status: 'ACCEPTED',
        displayName: 'Accepted Request',
      },
    ],
  },
};

const openClaimStep4WithClosedItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-06-07',
      currentPhaseBack: false,
      latestPhaseType: 'REVIEW_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
        phase3CompleteDate: '2024-06-07',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 3,
        closedDate: '2024-05-24',
        requestedDate: '2024-05-20',
        status: 'NO_LONGER_REQUIRED',
        displayName: 'No longer required Request',
      },
    ],
  },
};

const openClaimStep4WithDocumentsSubmittedForTrackedItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-06-07',
      currentPhaseBack: false,
      latestPhaseType: 'REVIEW_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
        phase3CompleteDate: '2024-06-07',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 5,
        requestedDate: '2024-05-20',
        status: 'SUBMITTED_AWAITING_REVIEW',
        displayName: 'Submitted awaiting Request',
        documents: [
          {
            uploadDate: '2024-05-24',
          },
        ],
      },
    ],
  },
};

const openClaimStep4WithDocumentsReceivedForTrackedItem = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-06-07',
      currentPhaseBack: false,
      latestPhaseType: 'REVIEW_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
        phase3CompleteDate: '2024-06-07',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 4,
        requestedDate: '2024-05-20',
        receivedDate: '2024-05-27',
        status: 'SUBMITTED_AWAITING_REVIEW',
        displayName: 'Submitted and received Request',
        documents: [
          {
            uploadDate: '2024-05-24',
          },
        ],
      },
    ],
  },
};

const openClaimStep4WithAuto5103Notice = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'REVIEW_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
        phase3CompleteDate: '2024-06-07',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        requestedDate: '2024-05-12',
        status: 'NEEDED_FROM_YOU',
        suspenseDate: '2024-08-07',
        displayName: 'Automated 5103 Notice Response',
      },
    ],
  },
};

const openClaimStep4WithClosed5103Notice = {
  attributes: {
    claimDate: '2024-05-02',
    claimPhaseDates: {
      phaseChangeDate: '2024-05-22',
      currentPhaseBack: false,
      latestPhaseType: 'REVIEW_OF_EVIDENCE',
      previousPhases: {
        phase1CompleteDate: '2024-05-10',
        phase2CompleteDate: '2024-05-22',
        phase3CompleteDate: '2024-06-07',
      },
    },
    claimTypeCode: '110LCMP7IDES',
    trackedItems: [
      {
        id: 1,
        requestedDate: '2024-05-12',
        status: 'NO_LONGER_REQUIRED',
        suspenseDate: '2024-08-07',
        displayName: '5103 Notice Response',
        closedDate: '2024-06-12',
      },
    ],
  },
};

describe('<RecentActivity>', () => {
  context('when cstClaimPhasesEnabled enabled', () => {
    context('when claim doesn’t have trackedItems', () => {
      context('when claim in phase 1', () => {
        it('should render recent activities section with 1 item', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep1} />
            </Provider>,
          );
          getByText('Recent activity');
          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(1);
          getByText('We received your claim in our system');
          expect($('va-pagination', container)).not.to.exist;
        });
      });
      context('when claim in phase 3 and has phased back', () => {
        it('should render recent activities section with 3 items', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep3PhaseBack} />
            </Provider>,
          );
          getByText('Recent activity');
          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(3);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved back to Step 3: Evidence gathering');
          expect($('va-pagination', container)).not.to.exist;
        });
      });
      context('when claim in phase 7', () => {
        it('should render recent activities section with 7 item', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep7} />
            </Provider>,
          );
          getByText('Recent activity');
          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(7);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText('Your claim moved into Step 4: Evidence review');
          getByText('Your claim moved into Step 5: Rating');
          getByText('Your claim moved into Step 6: Preparing decision letter');
          getByText('Your claim moved into Step 7: Final review');
          expect($('va-pagination', container)).not.to.exist;
        });
      });
      context('when claim is closed - phase 8', () => {
        it('should render recent activities section with 2 items', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={closedClaimStep8} />
            </Provider>,
          );
          getByText('Recent activity');
          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(2);
          getByText('We received your claim in our system');
          getByText('Your claim was decided');
          expect($('va-pagination', container)).not.to.exist;
        });
      });
    });
    context('when claim has trackedItems', () => {
      context('when claim in phase 3', () => {
        it('should render recent activities section with NEEDED_FROM_YOU record', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep3WithNeededFromYouItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText('Request for you');
          getByText('We opened a request: “friendly name”');
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with NEEDED_FROM_OTHERS record', () => {
          const { container, getByText, getByLabelText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep3WithNeededFromOthersItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText(
            'We made a request outside the VA: “third party friendly name.”',
          );
          expect($('va-alert', container)).to.exist;
          getByLabelText('About this notice for Third party friendly name');
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with NO_LONGER_REQUIRED record', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep3WithNoLongerRequiredItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText('We closed a request: “No longer required Request”');
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with SUBMITTED_AWAITING_REVIEW', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity
                claim={openClaimStep3WithSubmittedAwaitingReviewItem}
              />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText(
            'We received your document(s) for the request: “Submitted awaiting Request”',
          );
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with INITIAL_REVIEW_COMPLETE', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity
                claim={openClaimStep3WithInitialReviewCompleteItem}
              />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText(
            'We completed a review for the request: “Initial review complete Request”',
          );
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with ACCEPTED', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep3WithAcceptedItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(5);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText(`We opened a request: “Accepted Request”`);
          getByText(
            'We completed a review for the request: “Accepted Request”',
          );
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should mask activity descriptions from Datadog because they sometimes contain filenames (no PII)', () => {
          const { container } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep3WithAcceptedItem} />
            </Provider>,
          );
          expect(
            $('.item-description', container).getAttribute('data-dd-privacy'),
          ).to.equal('mask');
        });
      });
      context('when claim is in phase 4', () => {
        it('should render list with pagination', () => {
          const { container } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep4WithOver10Items} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(10);
          const pagination = $('va-pagination', container);
          expect(pagination).to.exist;
          expect(pagination.pages).to.equal(2);
        });
        it('shows closed tracked item history in recent activity', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity claim={openClaimStep4WithClosedItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(6);
          getByText('May 2, 2024');
          getByText('We received your claim in our system');
          getByText('May 10, 2024');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('May 20, 2024');
          getByText(`We opened a request: “No longer required Request”`);
          getByText('May 22, 2024');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText('May 24, 2024');
          getByText(`We closed a request: “No longer required Request”`);
          getByText('June 7, 2024');
          getByText(`Your claim moved into Step 4: Evidence review`);
        });
        it('shows documents submitted tracked item history in recent activity', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity
                claim={openClaimStep4WithDocumentsSubmittedForTrackedItem}
              />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(6);
          getByText('May 2, 2024');
          getByText('We received your claim in our system');
          getByText('May 10, 2024');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('May 20, 2024');
          getByText(`We opened a request: “Submitted awaiting Request”`);
          getByText('May 22, 2024');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText('May 24, 2024');
          getByText(
            `We received your document(s) for the request: “Submitted awaiting Request”`,
          );
          getByText('June 7, 2024');
          getByText(`Your claim moved into Step 4: Evidence review`);
        });
        it('shows documents submitted tracked item history in recent activity', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore(true)}>
              <RecentActivity
                claim={openClaimStep4WithDocumentsReceivedForTrackedItem}
              />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(7);
          getByText('May 2, 2024');
          getByText('We received your claim in our system');
          getByText('May 10, 2024');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('May 20, 2024');
          getByText(`We opened a request: “Submitted and received Request”`);
          getByText('May 22, 2024');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText('May 24, 2024');
          getByText(
            `We received your document(s) for the request: “Submitted and received Request”`,
          );
          getByText('May 27, 2024');
          getByText(
            `We completed a review for the request: “Submitted and received Request”`,
          );
          getByText('June 7, 2024');
          getByText(`Your claim moved into Step 4: Evidence review`);
        });
        context('when there is an Automated 5103 Notice Response item', () => {
          it('should render list', () => {
            const { container, getByText } = renderWithRouter(
              <Provider store={getStore(true)}>
                <RecentActivity claim={openClaimStep4WithAuto5103Notice} />
              </Provider>,
            );

            const recentActivityList = $('ol', container);
            expect(recentActivityList).to.exist;
            expect(
              within(recentActivityList).getAllByRole('listitem').length,
            ).to.equal(5);
            getByText('We received your claim in our system');
            getByText('Your claim moved into Step 2: Initial review');
            getByText('Your claim moved into Step 3: Evidence gathering');
            getByText('Your claim moved into Step 4: Evidence review');
            getByText('Request for you');
            getByText(
              'We opened a request: “List of evidence we may need (5103 notice)”',
            );
            expect($('va-pagination', container)).not.to.exist;
          });
        });
        context('when there is a closed 5103 Notice Response item', () => {
          it('should render list', () => {
            const { container, getByText } = renderWithRouter(
              <Provider store={getStore(true)}>
                <RecentActivity claim={openClaimStep4WithClosed5103Notice} />
              </Provider>,
            );

            const recentActivityList = $('ol', container);
            expect(recentActivityList).to.exist;
            expect(
              within(recentActivityList).getAllByRole('listitem').length,
            ).to.equal(6);
            getByText('We received your claim in our system');
            getByText('Your claim moved into Step 2: Initial review');
            getByText(
              `We opened a request: “List of evidence we may need (5103 notice)”`,
            );
            getByText('Your claim moved into Step 3: Evidence gathering');
            getByText('Your claim moved into Step 4: Evidence review');
            getByText(
              'We closed a request: “List of evidence we may need (5103 notice)”',
            );
            expect($('va-pagination', container)).not.to.exist;
          });
        });
      });
    });
  });

  context('when cstClaimPhasesEnabled disabled', () => {
    context('when claim doesn’t have trackedItems', () => {
      context('when claim in phase 1', () => {
        it('should render recent activities section with 1 item', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep1} />
            </Provider>,
          );
          getByText('Recent activity');
          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(1);
          getByText('Your claim moved into Step 1: Claim received');
          expect($('va-pagination', container)).not.to.exist;
        });
      });
      context('when claim in phase 3 and has phased back', () => {
        it('should render recent activities section with 3 items', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep3PhaseBack} />
            </Provider>,
          );
          getByText('Recent activity');
          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(3);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved back to Step 3: Evidence gathering, review, and decision',
          );
          expect($('va-pagination', container)).not.to.exist;
        });
      });
      context('when claim in phase 7', () => {
        it('should render recent activities section with 4 items', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep7} />
            </Provider>,
          );
          getByText('Recent activity');
          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText(
            'Your claim moved into Step 4: Preparation for notification',
          );
          expect($('va-pagination', container)).not.to.exist;
        });
      });
      context('when claim is closed - phase 8', () => {
        it('should render recent activities section with 2 items', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={closedClaimStep8} />
            </Provider>,
          );
          getByText('Recent activity');
          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(2);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 5: Closed');
          expect($('va-pagination', container)).not.to.exist;
        });
      });
    });
    context('when claim has trackedItems', () => {
      context('when claim in phase 3', () => {
        it('should render recent activities section with NEEDED_FROM_YOU record', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep3WithNeededFromYouItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText('Request for you');
          getByText('We opened a request: “friendly name”');
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with NEEDED_FROM_OTHERS record', () => {
          const { container, getByText, getByLabelText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep3WithNeededFromOthersItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText(
            'We made a request outside the VA: “third party friendly name.”',
          );
          expect($('va-alert', container)).to.exist;
          getByLabelText('About this notice for Third party friendly name');
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with NO_LONGER_REQUIRED record', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep3WithNoLongerRequiredItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText('We closed a request: “No longer required Request”');
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with SUBMITTED_AWAITING_REVIEW', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity
                claim={openClaimStep3WithSubmittedAwaitingReviewItem}
              />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText(
            'We received your document(s) for the request: “Submitted awaiting Request”',
          );
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with INITIAL_REVIEW_COMPLETE', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity
                claim={openClaimStep3WithInitialReviewCompleteItem}
              />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(4);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText(
            'We completed a review for the request: “Initial review complete Request”',
          );
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should render recent activities section with ACCEPTED', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep3WithAcceptedItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(5);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText(`We opened a request: “Accepted Request”`);
          getByText(
            'We completed a review for the request: “Accepted Request”',
          );
          expect($('va-pagination', container)).not.to.exist;
        });
        it('should mask activity descriptions from Datadog because they sometimes contain filenames (no PII)', () => {
          const { container } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep3WithAcceptedItem} />
            </Provider>,
          );
          expect(
            $('.item-description', container).getAttribute('data-dd-privacy'),
          ).to.equal('mask');
        });
      });
      context('when claim is in phase 4', () => {
        it('should render list with pagination', () => {
          const { container } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep4WithOver10Items} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(10);
          const pagination = $('va-pagination', container);
          expect(pagination).to.exist;
          expect(pagination.pages).to.equal(2);
        });
        it('shows closed tracked item history in recent activity', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep4WithClosedItem} />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(5);
          getByText('May 2, 2024');
          getByText('Your claim moved into Step 1: Claim received');
          getByText('May 10, 2024');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('May 20, 2024');
          getByText(`We opened a request: “No longer required Request”`);
          getByText('May 22, 2024');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText('May 24, 2024');
          getByText(`We closed a request: “No longer required Request”`);
        });
        it('shows documents submitted tracked item history in recent activity', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity
                claim={openClaimStep4WithDocumentsSubmittedForTrackedItem}
              />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(5);
          getByText('May 2, 2024');
          getByText('Your claim moved into Step 1: Claim received');
          getByText('May 10, 2024');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('May 20, 2024');
          getByText(`We opened a request: “Submitted awaiting Request”`);
          getByText('May 22, 2024');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText('May 24, 2024');
          getByText(
            `We received your document(s) for the request: “Submitted awaiting Request”`,
          );
        });
        it('shows documents submitted tracked item history in recent activity', () => {
          const { container, getByText } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity
                claim={openClaimStep4WithDocumentsReceivedForTrackedItem}
              />
            </Provider>,
          );

          const recentActivityList = $('ol', container);
          expect(recentActivityList).to.exist;
          expect(
            within(recentActivityList).getAllByRole('listitem').length,
          ).to.equal(6);
          getByText('May 2, 2024');
          getByText('Your claim moved into Step 1: Claim received');
          getByText('May 10, 2024');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('May 20, 2024');
          getByText(`We opened a request: “Submitted and received Request”`);
          getByText('May 22, 2024');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText('May 24, 2024');
          getByText(
            `We received your document(s) for the request: “Submitted and received Request”`,
          );
          getByText('May 27, 2024');
          getByText(
            `We completed a review for the request: “Submitted and received Request”`,
          );
        });
        context('when there is an Automated 5103 Notice Response item', () => {
          it('should render list', () => {
            const { container, getByText } = renderWithRouter(
              <Provider store={getStore(false)}>
                <RecentActivity claim={openClaimStep4WithAuto5103Notice} />
              </Provider>,
            );

            const recentActivityList = $('ol', container);
            expect(recentActivityList).to.exist;
            expect(
              within(recentActivityList).getAllByRole('listitem').length,
            ).to.equal(4);
            getByText('Your claim moved into Step 1: Claim received');
            getByText('Your claim moved into Step 2: Initial review');
            getByText(
              'Your claim moved into Step 3: Evidence gathering, review, and decision',
            );
            getByText('Request for you');
            getByText(
              'We opened a request: “List of evidence we may need (5103 notice)”',
            );
            expect($('va-pagination', container)).not.to.exist;
          });
        });
        context(
          'when there is a closed Automated 5103 Notice Response item',
          () => {
            it('should render list', () => {
              const { container, getByText } = renderWithRouter(
                <Provider store={getStore(false)}>
                  <RecentActivity claim={openClaimStep4WithClosed5103Notice} />
                </Provider>,
              );

              const recentActivityList = $('ol', container);
              expect(recentActivityList).to.exist;
              expect(
                within(recentActivityList).getAllByRole('listitem').length,
              ).to.equal(5);
              getByText('Your claim moved into Step 1: Claim received');
              getByText('Your claim moved into Step 2: Initial review');
              getByText(
                `We opened a request: “List of evidence we may need (5103 notice)”`,
              );
              getByText(
                'Your claim moved into Step 3: Evidence gathering, review, and decision',
              );
              getByText(
                'We closed a request: “List of evidence we may need (5103 notice)”',
              );
              expect($('va-pagination', container)).not.to.exist;
            });
          },
        );
      });
    });
  });

  context(
    'Render updated content with evidence request friendly language feature',
    () => {
      it('should render friendly disaply name with NEEDED_FROM_YOU record', () => {
        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <RecentActivity claim={openClaimStep3WithNeededFromYouItem} />
          </Provider>,
        );
        getByText(`We opened a request: “friendly name”`);
      });
      it('should render update message with NEEDED_FROM_OTHERS record', () => {
        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <RecentActivity claim={openClaimStep3WithNeededFromOthersItem} />
          </Provider>,
        );
        getByText(
          `We made a request outside the VA: “third party friendly name.”`,
        );
        getByText(/you don’t need to do anything/i);
        getByText(
          `We asked someone outside VA for documents related to your claim.`,
        );
      });
      it('should render update message if track item is a DBQ', () => {
        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <RecentActivity claim={openClaimStep3WithDBQItem} />
          </Provider>,
        );
        getByText(`We made a request: “dBQ friendly name.”`);
        getByText(
          /We’ve requested an exam related to your claim. The examiner’s office will contact you to schedule this appointment./i,
        );
      });
      it('should render friendly display name, updated activity message and activity description with NEEDED_FROM_OTHERS record with activity description', () => {
        const { getByText, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <RecentActivity
              claim={
                openClaimStep3WithNeededFromOthersItemwithActivityDescription
              }
            />
          </Provider>,
        );
        getByText(
          `We made a request outside the VA: “third party friendly name.”`,
        );
        expect(queryByText(/you don’t need to do anything/i)).to.be.null;
        expect(
          queryByText(
            `We asked someone outside VA for documents related to your claim.`,
          ),
        ).to.be.null;
        getByText('Activity Description');
      });
      it('should render default dbq message when the dbq item does not have overwrite content', () => {
        const { getByText, queryByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <RecentActivity claim={openClaimStep3WithDBQItemNoOverride} />
          </Provider>,
        );
        getByText(`We made a request: “DBQ no override.”`);
        expect(queryByText(/you don’t have to do anything/i)).to.be.null;
        expect(
          queryByText(
            `We asked someone outside VA for documents related to your claim.`,
          ),
        ).to.be.null;
        expect(
          queryByText(
            `We’ve requested an exam related to your claim. The examiner’s office will contact you to schedule this appointment.`,
          ),
        ).to.exist;
      });
    },
  );

  context('Timezone-aware message display', () => {
    let timezoneStub;

    beforeEach(() => {
      // Stub CST timezone (-360 = UTC-6) for all tests by default
      // Individual tests can override by restoring and re-stubbing
      timezoneStub = sinon
        .stub(Date.prototype, 'getTimezoneOffset')
        .returns(-360);
    });

    afterEach(() => {
      if (timezoneStub) {
        timezoneStub.restore();
        timezoneStub = null;
      }
    });

    it('should display timezone message below Recent activity heading', () => {
      // Enable timezone discrepancy feature toggle
      const { getByText } = renderWithRouter(
        <Provider store={getStore(false, true)}>
          <RecentActivity claim={openClaimStep1} />
        </Provider>,
      );

      getByText('Recent activity');
      expect(getByText(/Files uploaded (after|before).*will show (with|as)/)).to
        .exist;
    });

    it('should include time and timezone in message', () => {
      const { getByText } = renderWithRouter(
        <Provider store={getStore(false, true)}>
          <RecentActivity claim={openClaimStep1} />
        </Provider>,
      );

      const messageParagraph = getByText(
        /Files uploaded (after|before).*will show (with|as)/,
      );
      expect(messageParagraph.textContent).to.match(
        /\d{1,2}:\d{2}\s+(a|p)\.m\./,
      );
    });

    it('should NOT display message when in UTC timezone (offset = 0)', () => {
      // Restore beforeEach stub and re-stub with UTC timezone (0)
      timezoneStub.restore();
      timezoneStub = sinon.stub(Date.prototype, 'getTimezoneOffset').returns(0);

      const { queryByText } = renderWithRouter(
        <Provider store={getStore(false, true)}>
          <RecentActivity claim={openClaimStep1} />
        </Provider>,
      );

      // Heading should exist
      expect(queryByText('Recent activity')).to.exist;

      // Message should NOT exist when timezone offset is 0 (UTC)
      expect(queryByText(/Files uploaded/)).to.not.exist;
    });

    it('should NOT display message when feature toggle is disabled', () => {
      // Disable timezone discrepancy feature toggle
      const { queryByText } = renderWithRouter(
        <Provider store={getStore(false, false)}>
          <RecentActivity claim={openClaimStep1} />
        </Provider>,
      );

      // Heading should exist
      expect(queryByText('Recent activity')).to.exist;

      // Message should NOT exist when toggle is disabled
      expect(queryByText(/Files uploaded/)).to.not.exist;
      expect(queryByText(/will show as received/)).to.not.exist;
    });

    it('should not render message paragraph element when toggle is disabled', () => {
      const { container } = renderWithRouter(
        <Provider store={getStore(false, false)}>
          <RecentActivity claim={openClaimStep1} />
        </Provider>,
      );

      const heading = container.querySelector('h3');
      expect(heading).to.exist;
      expect(heading.textContent).to.equal('Recent activity');

      // Find all paragraphs in recent-activity-container
      const activityContainer = container.querySelector(
        '.recent-activity-container',
      );
      const paragraphs = activityContainer.querySelectorAll('p');

      // No paragraph should contain timezone message when toggle disabled
      paragraphs.forEach(p => {
        expect(p.textContent).to.not.include('Files uploaded');
      });
    });

    it('should conditionally render message based on feature toggle', () => {
      // Test with toggle ENABLED (should render)
      const { container, rerender } = renderWithRouter(
        <Provider store={getStore(false, true)}>
          <RecentActivity claim={openClaimStep1} />
        </Provider>,
      );

      let messageParagraph = container.querySelector(
        '.vads-u-color--gray-medium',
      );
      expect(messageParagraph).to.exist;
      expect(messageParagraph.textContent).to.include('Files uploaded');

      // Re-render with toggle DISABLED
      rerender(
        <Provider store={getStore(false, false)}>
          <RecentActivity claim={openClaimStep1} />
        </Provider>,
      );

      // Message paragraph should not exist when toggle is disabled
      messageParagraph = container.querySelector('.vads-u-color--gray-medium');
      expect(messageParagraph?.textContent || '').to.not.include(
        'Files uploaded',
      );
    });
  });

  context('isDBQ boolean property fallback pattern', () => {
    it('should use API value when provided (true)', () => {
      const claimWithApiIsDBQTrue = {
        attributes: {
          claimDate: '2024-05-02',
          claimPhaseDates: {
            phaseChangeDate: '2024-05-22',
            currentPhaseBack: false,
            latestPhaseType: 'GATHERING_OF_EVIDENCE',
            previousPhases: {
              phase1CompleteDate: '2024-05-10',
              phase2CompleteDate: '2024-05-22',
            },
          },
          claimTypeCode: '110LCMP7IDES',
          trackedItems: [
            {
              id: 1,
              requestedDate: '2024-05-12',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'Non-DBQ Request', // Doesn't include 'dbq'
              friendlyName: 'Test Request',
              isDBQ: true, // API value is true
            },
          ],
        },
      };

      const { getByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <RecentActivity claim={claimWithApiIsDBQTrue} />
        </Provider>,
      );

      // Should show DBQ message because API value is true
      getByText('We made a request: “test Request.”');
    });

    it('should fall back to displayName check when API value is false', () => {
      const claimWithApiIsDBQFalse = {
        attributes: {
          claimDate: '2024-05-02',
          claimPhaseDates: {
            phaseChangeDate: '2024-05-22',
            currentPhaseBack: false,
            latestPhaseType: 'GATHERING_OF_EVIDENCE',
            previousPhases: {
              phase1CompleteDate: '2024-05-10',
              phase2CompleteDate: '2024-05-22',
            },
          },
          claimTypeCode: '110LCMP7IDES',
          trackedItems: [
            {
              id: 1,
              requestedDate: '2024-05-12',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'DBQ AUDIO Hearing Loss', // Contains 'dbq'
              friendlyName: 'DBQ Test',
              isDBQ: false, // API says false, but displayName contains 'dbq'
            },
          ],
        },
      };

      const { getByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <RecentActivity claim={claimWithApiIsDBQFalse} />
        </Provider>,
      );

      // Should show DBQ message because displayName contains 'dbq'
      getByText(`We made a request: “dBQ Test.”`);
    });

    it('should fallback to evidenceDictionary when API value not provided', () => {
      const claimWithDictIsDBQ = {
        attributes: {
          claimDate: '2024-05-02',
          claimPhaseDates: {
            phaseChangeDate: '2024-05-22',
            currentPhaseBack: false,
            latestPhaseType: 'GATHERING_OF_EVIDENCE',
            previousPhases: {
              phase1CompleteDate: '2024-05-10',
              phase2CompleteDate: '2024-05-22',
            },
          },
          claimTypeCode: '110LCMP7IDES',
          trackedItems: [
            {
              id: 1,
              requestedDate: '2024-05-12',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'DBQ AUDIO Hearing Loss and Tinnitus', // In dictionary with isDBQ: true
              friendlyName: 'Hearing Test',
              // No isDBQ property from API
            },
          ],
        },
      };

      const { getByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <RecentActivity claim={claimWithDictIsDBQ} />
        </Provider>,
      );

      // Should use dictionary value (true)
      getByText('We made a request: “hearing Test.”');
    });

    it('should fallback to displayName check when neither API nor dictionary has value', () => {
      const claimWithDbqInName = {
        attributes: {
          claimDate: '2024-05-02',
          claimPhaseDates: {
            phaseChangeDate: '2024-05-22',
            currentPhaseBack: false,
            latestPhaseType: 'GATHERING_OF_EVIDENCE',
            previousPhases: {
              phase1CompleteDate: '2024-05-10',
              phase2CompleteDate: '2024-05-22',
            },
          },
          claimTypeCode: '110LCMP7IDES',
          trackedItems: [
            {
              id: 1,
              requestedDate: '2024-05-12',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'Some DBQ Related Request', // Contains 'dbq' but not in dictionary
              friendlyName: 'DBQ Request',
              // No isDBQ property from API or dictionary
            },
          ],
        },
      };

      const { getByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <RecentActivity claim={claimWithDbqInName} />
        </Provider>,
      );

      // Should detect 'dbq' in displayName
      getByText('We made a request: “dBQ Request.”');
    });

    it('should default to false when all fallbacks fail', () => {
      const claimWithNoDBQ = {
        attributes: {
          claimDate: '2024-05-02',
          claimPhaseDates: {
            phaseChangeDate: '2024-05-22',
            currentPhaseBack: false,
            latestPhaseType: 'GATHERING_OF_EVIDENCE',
            previousPhases: {
              phase1CompleteDate: '2024-05-10',
              phase2CompleteDate: '2024-05-22',
            },
          },
          claimTypeCode: '110LCMP7IDES',
          trackedItems: [
            {
              id: 1,
              requestedDate: '2024-05-12',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'Medical Records Request', // Not in dictionary, no 'dbq'
              friendlyName: 'Medical Records',
              // No isDBQ property from API
            },
          ],
        },
      };

      const { getByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <RecentActivity claim={claimWithNoDBQ} />
        </Provider>,
      );

      // Should default to false (outside VA request)
      getByText('We made a request outside the VA: “medical Records.”');
    });

    it('should fall back to displayName check when API value is false and displayName contains dbq', () => {
      const claimWithConflict = {
        attributes: {
          claimDate: '2024-05-02',
          claimPhaseDates: {
            phaseChangeDate: '2024-05-22',
            currentPhaseBack: false,
            latestPhaseType: 'GATHERING_OF_EVIDENCE',
            previousPhases: {
              phase1CompleteDate: '2024-05-10',
              phase2CompleteDate: '2024-05-22',
            },
          },
          claimTypeCode: '110LCMP7IDES',
          trackedItems: [
            {
              id: 1,
              requestedDate: '2024-05-12',
              status: 'NEEDED_FROM_OTHERS',
              displayName: 'DBQ Test Item',
              friendlyName: 'DBQ Test',
              isDBQ: false, // API says false, but displayName contains 'dbq'
            },
          ],
        },
      };

      const { getByText } = renderWithRouter(
        <Provider store={getStore(false)}>
          <RecentActivity claim={claimWithConflict} />
        </Provider>,
      );

      // displayName check should be used as fallback
      getByText(`We made a request: “dBQ Test.”`);
    });
  });
});
