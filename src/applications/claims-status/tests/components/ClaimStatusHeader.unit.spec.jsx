import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import ClaimStatusHeader from '../../components/ClaimStatusHeader';

describe('<ClaimStatusHeader>', () => {
  context('when the claim doesnt have tracked items', () => {
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
            phaseChangeDate: '2023-02-18',
            latestPhaseType: 'INITIAL_REVIEW',
            previousPhases: {
              phase1CompleteDate: '2023-02-08',
              phase2CompleteDate: '2023-02-18',
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
      expect(getByText('Last updated: February 18, 2023')).to.exist;
    });

    it('should render a ClaimStatusHeader section for a Complete claim', () => {
      const claim = {
        id: '1',
        attributes: {
          supportingDocuments: [],
          claimDate: '2023-01-01',
          closeDate: '2023-12-12',
          documentsNeeded: true,
          decisionLetterSent: false,
          status: 'COMPLETE',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2023-12-12',
            latestPhaseType: 'Complete',
            previousPhases: {
              phase7CompleteDate: '2023-12-12',
            },
          },
        },
      };
      const { container, queryByText } = render(
        <ClaimStatusHeader claim={claim} />,
      );
      expect($('.claim-status-header-container', container)).to.exist;
      expect(queryByText('In Progress')).not.to.exist;
      expect($('.usa-label', container)).to.not.exist;
      expect(queryByText('Last updated')).not.to.exist;
    });
  });
  context('when the claim has tracked items', () => {
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
            phaseChangeDate: '2023-02-18',
            latestPhaseType: 'INITIAL_REVIEW',
            previousPhases: {
              phase1CompleteDate: '2023-02-08',
              phase2CompleteDate: '2023-02-18',
            },
          },
          trackedItems: [
            {
              id: 1,
              requestedDate: '2023-02-22',
              receivedDate: '2023-02-25',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
            {
              id: 2,
              requestedDate: '2023-02-15',
              receivedDate: '2023-02-15',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
          ],
        },
      };
      const { container, getByText } = render(
        <ClaimStatusHeader claim={claim} />,
      );
      expect($('.claim-status-header-container', container)).to.exist;
      expect($('.usa-label', container)).to.exist;
      expect(getByText('In Progress')).to.exist;
      expect(getByText('Last updated: February 25, 2023')).to.exist;
    });

    it('should render a ClaimStatusHeader section for a Complete claim', () => {
      const claim = {
        id: '1',
        attributes: {
          supportingDocuments: [],
          claimDate: '2023-01-01',
          closeDate: '2023-12-12',
          documentsNeeded: true,
          decisionLetterSent: false,
          status: 'COMPLETE',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2023-12-12',
            latestPhaseType: 'Complete',
            previousPhases: {
              phase7CompleteDate: '2023-12-12',
            },
          },
        },
      };
      const { container, queryByText } = render(
        <ClaimStatusHeader claim={claim} />,
      );
      expect($('.claim-status-header-container', container)).to.exist;
      expect(queryByText('In Progress')).not.to.exist;
      expect($('.usa-label', container)).to.not.exist;
      expect(queryByText('Last updated')).not.to.exist;
    });
  });
});
