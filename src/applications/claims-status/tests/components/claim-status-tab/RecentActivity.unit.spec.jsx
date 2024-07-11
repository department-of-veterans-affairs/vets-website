import React from 'react';
import { within } from '@testing-library/react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import RecentActivity from '../../../components/claim-status-tab/RecentActivity';
import { renderWithRouter } from '../../utils';

const getStore = (cstClaimPhasesEnabled = false) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_claim_phases: cstClaimPhasesEnabled,
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
        requestedDate: '2024-05-12',
        status: 'ACCEPTED',
        displayName: 'Accepted Request',
      },
    ],
  },
};

const openClaimStep4WithMultipleItems = {
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
          getByText('We opened a request for "Needed from you Request"');
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
          getByText('Request for others');
          getByText('We opened a request for "Needed from others Request"');
          expect($('va-alert', container)).to.exist;
          getByLabelText('Add information for Needed from others Request');
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
          getByText('We closed a request for "No longer required Request"');
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
            'We received your document(s) for "Submitted awaiting Request"',
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
            'We completed a review for "Initial review complete Request"',
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
          ).to.equal(4);
          getByText('We received your claim in our system');
          getByText('Your claim moved into Step 2: Initial review');
          getByText('Your claim moved into Step 3: Evidence gathering');
          getByText('We completed a review for "Accepted Request"');
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
              <RecentActivity claim={openClaimStep4WithMultipleItems} />
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
          getByText('We opened a request for "Needed from you Request"');
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
          getByText('Request for others');
          getByText('We opened a request for "Needed from others Request"');
          expect($('va-alert', container)).to.exist;
          getByLabelText('Add information for Needed from others Request');
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
          getByText('We closed a request for "No longer required Request"');
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
            'We received your document(s) for "Submitted awaiting Request"',
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
            'We completed a review for "Initial review complete Request"',
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
          ).to.equal(4);
          getByText('Your claim moved into Step 1: Claim received');
          getByText('Your claim moved into Step 2: Initial review');
          getByText(
            'Your claim moved into Step 3: Evidence gathering, review, and decision',
          );
          getByText('We completed a review for "Accepted Request"');
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
        it('should render list with pagination and ', () => {
          const { container } = renderWithRouter(
            <Provider store={getStore()}>
              <RecentActivity claim={openClaimStep4WithMultipleItems} />
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
      });
    });
  });
});
