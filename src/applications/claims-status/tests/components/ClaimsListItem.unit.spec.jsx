import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import ClaimsListItem from '../../components/ClaimsListItem';
import { renderWithRouter } from '../utils';

const getStore = (
  cstClaimPhasesEnabled = true,
  cstShowDocumentUploadStatus = false,
  champvaProviderEnabled = false,
) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_claim_phases: cstClaimPhasesEnabled,
      // eslint-disable-next-line camelcase
      cst_show_document_upload_status: cstShowDocumentUploadStatus,
      // eslint-disable-next-line camelcase
      benefits_claims_ivc_champva_provider: champvaProviderEnabled,
    },
  }));

const createFailedSubmission = (acknowledgementDate, failedDate) => ({
  acknowledgementDate,
  id: 1,
  claimId: 1,
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  deleteDate: null,
  documentType: 'Medical Records',
  failedDate,
  fileName: 'medical-records.pdf',
  lighthouseUpload: true,
  trackedItemId: null,
  trackedItemDisplayName: null,
  uploadStatus: 'FAILED',
  vaNotifyStatus: 'SENT',
});

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
        expect(queryByText('We requested more information from you:')).to.be
          .null;
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
        getByText('We requested more information from you:');
        getByText('Check the claim details to learn more.');
        getByText(
          'This message will go away when we finish reviewing your response.',
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
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );

        const link = container.querySelector('va-link');

        expect(link).to.have.attribute('text', 'Details');
        expect(link).to.have.attribute(
          'href',
          '/track-claims/your-claims/1/status',
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
        expect(queryByText('We requested more information from you:')).to.be
          .null;
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
        getByText('We requested more information from you:');
        getByText('Check the claim details to learn more.');
        getByText(
          'This message will go away when we finish reviewing your response.',
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
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );

        const link = container.querySelector('va-link');

        expect(link).to.have.attribute('text', 'Details');
        expect(link).to.have.attribute(
          'href',
          '/track-claims/your-claims/1/status',
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
        expect(queryByText('We requested more information from you:')).to.be
          .null;
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
        getByText('We requested more information from you:');
        getByText('Check the claim details to learn more.');
        getByText(
          'This message will go away when we finish reviewing your response.',
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
        const { container } = renderWithRouter(
          <Provider store={getStore(false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );

        const link = container.querySelector('va-link');

        expect(link).to.have.attribute('text', 'Details');
        expect(link).to.have.attribute(
          'href',
          '/track-claims/your-claims/1/status',
        );
      });
    },
  );

  context('when a claim has no phase metadata', () => {
    it('renders fallback status and last updated text for server-generated claims', () => {
      const claim = {
        id: 42,
        attributes: {
          claimDate: '2025-01-10',
          closeDate: '2025-01-17',
          displayTitle: 'Claim for CHAMPVA application',
          claimTypeBase: 'champva application claim',
          status: 'Processed',
        },
      };

      const { container, getByText, queryByText } = renderWithRouter(
        <Provider store={getStore(false, false, true)}>
          <ClaimsListItem claim={claim} />
        </Provider>,
      );

      getByText('Application for CHAMPVA benefits');
      getByText('Received');
      expect(container).to.contain.text('Submitted on: January 10, 2025');
      expect(container).to.contain.text('Received on: January 17, 2025');
      const reviewLink = container.querySelector(
        'va-link[text="Review details"]',
      );
      expect(reviewLink).to.not.exist;
      expect(queryByText('Processed')).to.be.null;
    });

    it('renders Submitted label for IVC CHAMPVA form IDs without champva text in title', () => {
      const claim = {
        id: 43,
        attributes: {
          claimDate: '2025-01-10',
          closeDate: '2025-01-17',
          displayTitle: 'Claim for 10-10d-extended',
          claimTypeBase: '10-10d-extended claim',
          status: 'Submission failed',
        },
      };

      const { container, getByText, queryByText } = renderWithRouter(
        <Provider store={getStore(false, false, true)}>
          <ClaimsListItem claim={claim} />
        </Provider>,
      );

      getByText('Application for CHAMPVA benefits');
      getByText('Action Needed');
      getByText('VA Form 10-10d');
      expect(container).to.contain.text('Submitted on: January 10, 2025');
      expect(container).to.not.contain.text('Received on: January 17, 2025');
      const reviewLink = container.querySelector(
        'va-link[text="Review details"]',
      );
      expect(reviewLink).to.not.exist;
      expect(queryByText('Submission failed')).to.be.null;
    });
  });

  context(
    'when the cst_show_document_upload_status feature toggle is disabled',
    () => {
      it('should not render a slim alert', () => {
        const claim = {
          id: 1,
          attributes: {
            claimDate: '2024-06-08',
            claimPhaseDates: {
              phaseChangeDate: '2024-06-08',
              phaseType: 'GATHERING_OF_EVIDENCE',
            },
            claimTypeCode: compensationClaimTypeCode,
            status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
            evidenceSubmissions: [
              createFailedSubmission(
                new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
                new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              ),
            ],
          },
        };
        const { container } = renderWithRouter(
          <Provider store={getStore(true, false)}>
            <ClaimsListItem claim={claim} />
          </Provider>,
        );
        const alert = container.querySelector('va-alert[status="error"]');

        expect(alert).to.not.exist;
      });
    },
  );

  context(
    'when the cst_show_document_upload_status feature toggle is enabled',
    () => {
      context(
        'when there are no failed evidence submissions within the last 30 days',
        () => {
          it('should not render a slim alert', () => {
            const claim = {
              id: 1,
              attributes: {
                claimDate: '2024-06-08',
                claimPhaseDates: {
                  phaseChangeDate: '2024-06-08',
                  phaseType: 'GATHERING_OF_EVIDENCE',
                },
                claimTypeCode: compensationClaimTypeCode,
                status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
                evidenceSubmissions: [
                  createFailedSubmission(
                    new Date(
                      Date.now() - 1 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    new Date(
                      Date.now() + 31 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                  ),
                ],
              },
            };
            const { container } = renderWithRouter(
              <Provider store={getStore(true, true)}>
                <ClaimsListItem claim={claim} />
              </Provider>,
            );
            const alert = container.querySelector('va-alert[status="error"]');

            expect(alert).to.not.exist;
          });
        },
      );

      context(
        'when there are failed evidence submissions within the last 30 days',
        () => {
          it('should render a slim alert', () => {
            const claim = {
              id: 1,
              attributes: {
                claimDate: '2024-06-08',
                claimPhaseDates: {
                  phaseChangeDate: '2024-06-08',
                  phaseType: 'GATHERING_OF_EVIDENCE',
                },
                claimTypeCode: compensationClaimTypeCode,
                status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
                evidenceSubmissions: [
                  createFailedSubmission(
                    new Date(
                      Date.now() + 28 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                    new Date(
                      Date.now() - 2 * 24 * 60 * 60 * 1000,
                    ).toISOString(),
                  ),
                ],
              },
            };
            const { container } = renderWithRouter(
              <Provider store={getStore(true, true)}>
                <ClaimsListItem claim={claim} />
              </Provider>,
            );
            const alert = container.querySelector('va-alert[status="error"]');

            expect(alert).to.exist;
            expect(alert.querySelector('p')).to.have.text(
              'We need you to resubmit files for this claim.',
            );
          });
        },
      );
    },
  );
});
