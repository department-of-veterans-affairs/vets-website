import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import ClaimsListItem from '../../components/ClaimsListItem';
import { renderWithRouter } from '../utils';

const getStore = (cstClaimPhasesEnabled = true) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_claim_phases: cstClaimPhasesEnabled,
    },
  }));

const dependencyClaimTypeCode = '400PREDSCHRG';
const compensationClaimTypeCode = '110LCMP7IDES'; // 5103 Notice

describe('<ClaimsListItem>', () => {
  context(
    'cstClaimPhases feature flag enabled and compenstaiton claim type code',
    () => {
      it('should not show any flags and render proper fields', () => {
        const claim = {
          id: 1,
          attributes: {
            claimDate: '2024-06-08',
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'CLAIM_RECEIVED',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: false,
            documentsNeeded: false,
            status: 'CLAIM_RECEIVED',
          },
        };

        const { queryByRole, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByRole('listitem')).not.to.exist;
        getByText('Received on June 8, 2024');
        getByText('Step 1 of 8: Claim received');
        getByText('Moved to this step on June 8, 2024');
      });
      it('should show closed status', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'COMPLETE',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 8 of 8: Claim decided');
      });
      it('should show the correct status when UNDER_REVIEW', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'INITIAL_REVIEW',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 2 of 8: Initial review');
      });
      it('should show the correct status when REVIEW_OF_EVIDENCE', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'REVIEW_OF_EVIDENCE',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 4 of 8: Evidence review');
      });
      it('should show the correct status when PREPARATION_FOR_DECISION', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PREPARATION_FOR_DECISION',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 5 of 8: Rating');
      });
      it('should show the correct status when PENDING_DECISION_APPROVAL', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PENDING_DECISION_APPROVAL',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'PREPARATION_FOR_NOTIFICATION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 6 of 8: Preparing decision letter');
      });
      it('should show the correct status when PREPARATION_FOR_NOTIFICATION', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PREPARATION_FOR_NOTIFICATION',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'PREPARATION_FOR_NOTIFICATION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 7 of 8: Final review');
      });
      it('should show development letter flag', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'GATHERING_OF_EVIDENCE',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: true,
            documentsNeeded: false,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('We sent you a development letter');
        getByText('Step 3 of 8: Evidence gathering');
      });
      it('should show decision letter flag decisionLetterSent is true, but not render the other flags', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: true,
            developmentLetterSent: true,
            documentsNeeded: true,
            status: 'INITIAL_REVIEW',
          },
        };

        const { queryByText, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByText('We sent you a development letter')).to.be.null;
        expect(
          queryByText(
            'Open request: Check claim to see if action is needed from you or VA.',
          ),
        ).to.be.null;
        expect(getByText('You have a decision letter ready')).to.exist;
        getByText('Step 2 of 8: Initial review');
      });
      it('should show items needed flag', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: false,
            documentsNeeded: true,
            status: 'INITIAL_REVIEW',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText(
          'Open request: Check claim to see if action is needed from you or VA.',
        );
        getByText('Step 2 of 8: Initial review');
      });
      it('should not show any flags when closed', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: true,
            documentsNeeded: true,
            status: 'COMPLETE',
          },
        };

        const { queryByRole, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByRole('listitem')).not.to.exist;
        getByText('Step 8 of 8: Claim decided');
      });
      it('should render a link to the claim status page', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'COMPLETE',
          },
        };
        const { getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );

        expect(getByRole('link')).to.have.text('Details');
        expect(getByRole('link').href).to.equal(
          `http://localhost/your-claims/1/status`,
        );
      });
    },
  );

  context(
    'cstClaimPhases feature flag enabled and dependency claim type code',
    () => {
      it('should not show any flags', () => {
        const claim = {
          id: 1,
          attributes: {
            claimDate: '2024-06-08',
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'CLAIM_RECEIVED',
            },
            claimTypeCode: dependencyClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: false,
            documentsNeeded: false,
            status: 'CLAIM_RECEIVED',
          },
        };

        const { queryByRole, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByRole('listitem')).not.to.exist;
        getByText('Received on June 8, 2024');
        getByText('Step 1 of 5: Claim received');
        getByText('Moved to this step on June 8, 2024');
      });
      it('should show closed status', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: dependencyClaimTypeCode,
            status: 'COMPLETE',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 5 of 5: Closed');
      });
      it('should show the correct status when UNDER_REVIEW', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: dependencyClaimTypeCode,
            status: 'INITIAL_REVIEW',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 2 of 5: Initial review');
      });
      it('should show the correct status when REVIEW_OF_EVIDENCE', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'REVIEW_OF_EVIDENCE',
            },
            claimTypeCode: dependencyClaimTypeCode,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 3 of 5: Evidence gathering, review, and decision');
      });
      it('should show the correct status when PREPARATION_FOR_DECISION', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PREPARATION_FOR_DECISION',
            },
            claimTypeCode: dependencyClaimTypeCode,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 3 of 5: Evidence gathering, review, and decision');
      });
      it('should show the correct status when PENDING_DECISION_APPROVAL', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PENDING_DECISION_APPROVAL',
            },
            claimTypeCode: dependencyClaimTypeCode,
            status: 'PREPARATION_FOR_NOTIFICATION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 4 of 5: Preparation for notification');
      });
      it('should show the correct status when PREPARATION_FOR_NOTIFICATION', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PREPARATION_FOR_NOTIFICATION',
            },
            claimTypeCode: dependencyClaimTypeCode,
            status: 'PREPARATION_FOR_NOTIFICATION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 4 of 5: Preparation for notification');
      });
      it('should show development letter flag', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'GATHERING_OF_EVIDENCE',
            },
            claimTypeCode: dependencyClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: true,
            documentsNeeded: false,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('We sent you a development letter');
        getByText('Step 3 of 5: Evidence gathering, review, and decision');
      });
      it('should show decision letter flag decisionLetterSent is true, but not render the other flags', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: dependencyClaimTypeCode,
            decisionLetterSent: true,
            developmentLetterSent: true,
            documentsNeeded: true,
            status: 'INITIAL_REVIEW',
          },
        };

        const { queryByText, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByText('We sent you a development letter')).to.be.null;
        expect(
          queryByText(
            'Open request: Check claim to see if action is needed from you or VA.',
          ),
        ).to.be.null;
        expect(getByText('You have a decision letter ready')).to.exist;
        getByText('Step 2 of 5: Initial review');
      });
      it('should show items needed flag', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: dependencyClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: false,
            documentsNeeded: true,
            status: 'INITIAL_REVIEW',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText(
          'Open request: Check claim to see if action is needed from you or VA.',
        );
        getByText('Step 2 of 5: Initial review');
      });
      it('should not show any flags when closed', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: dependencyClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: true,
            documentsNeeded: true,
            status: 'COMPLETE',
          },
        };

        const { queryByRole, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByRole('listitem')).not.to.exist;
        getByText('Step 5 of 5: Closed');
      });
      it('should render a link to the claim status page', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: dependencyClaimTypeCode,
            status: 'COMPLETE',
          },
        };
        const { getByRole } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );

        expect(getByRole('link')).to.have.text('Details');
        expect(getByRole('link').href).to.equal(
          `http://localhost/your-claims/1/status`,
        );
      });
    },
  );

  context(
    'cstClaimPhases feature flag disabled and compenstaiton claim type code',
    () => {
      it('should not show any flags and render proper fields', () => {
        const claim = {
          id: 1,
          attributes: {
            claimDate: '2024-06-08',
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'CLAIM_RECEIVED',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: false,
            documentsNeeded: false,
            status: 'CLAIM_RECEIVED',
          },
        };

        const { queryByRole, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByRole('listitem')).not.to.exist;
        getByText('Received on June 8, 2024');
        getByText('Step 1 of 5: Claim received');
        getByText('Moved to this step on June 8, 2024');
      });
      it('should show closed status', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'COMPLETE',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 5 of 5: Closed');
      });
      it('should show the correct status when UNDER_REVIEW', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'INITIAL_REVIEW',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 2 of 5: Initial review');
      });
      it('should show the correct status when REVIEW_OF_EVIDENCE', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'REVIEW_OF_EVIDENCE',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 3 of 5: Evidence gathering, review, and decision');
      });
      it('should show the correct status when PREPARATION_FOR_DECISION', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PREPARATION_FOR_DECISION',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 3 of 5: Evidence gathering, review, and decision');
      });
      it('should show the correct status when PENDING_DECISION_APPROVAL', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PENDING_DECISION_APPROVAL',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'PREPARATION_FOR_NOTIFICATION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 4 of 5: Preparation for notification');
      });
      it('should show the correct status when PREPARATION_FOR_NOTIFICATION', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'PREPARATION_FOR_NOTIFICATION',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'PREPARATION_FOR_NOTIFICATION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('Step 4 of 5: Preparation for notification');
      });
      it('should show development letter flag', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'GATHERING_OF_EVIDENCE',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: true,
            documentsNeeded: false,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText('We sent you a development letter');
        getByText('Step 3 of 5: Evidence gathering, review, and decision');
      });
      it('should show decision letter flag decisionLetterSent is true, but not render the other flags', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: true,
            developmentLetterSent: true,
            documentsNeeded: true,
            status: 'INITIAL_REVIEW',
          },
        };

        const { queryByText, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByText('We sent you a development letter')).to.be.null;
        expect(
          queryByText(
            'Open request: Check claim to see if action is needed from you or VA.',
          ),
        ).to.be.null;
        expect(getByText('You have a decision letter ready')).to.exist;
        getByText('Step 2 of 5: Initial review');
      });
      it('should show items needed flag', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'UNDER_REVIEW',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: false,
            documentsNeeded: true,
            status: 'INITIAL_REVIEW',
          },
        };

        const { getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        getByText(
          'Open request: Check claim to see if action is needed from you or VA.',
        );
        getByText('Step 2 of 5: Initial review');
      });
      it('should not show any flags when closed', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: compensationClaimTypeCode,
            decisionLetterSent: false,
            developmentLetterSent: true,
            documentsNeeded: true,
            status: 'COMPLETE',
          },
        };

        const { queryByRole, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        expect(queryByRole('listitem')).not.to.exist;
        getByText('Step 5 of 5: Closed');
      });
      it('should render a link to the claim status page', () => {
        const claim = {
          id: 1,
          attributes: {
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'COMPLETE',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'COMPLETE',
          },
        };
        const { getByRole } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );

        expect(getByRole('link')).to.have.text('Details');
        expect(getByRole('link').href).to.equal(
          `http://localhost/your-claims/1/status`,
        );
      });
    },
  );
});
