import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { OverviewPage } from '../../containers/OverviewPage';
import { renderWithRouter } from '../utils';

const props = {
  claim: {},
  clearNotification: () => {},
  lastPage: '',
  loading: false,
  message: {},
  params: { id: 1 },
};

describe('<OverviewPage>', () => {
  const getStore = (cstClaimPhasesEnabled = true) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_claim_phases: cstClaimPhasesEnabled,
      },
    }));

  it('should render null when claim empty', () => {
    const { container, getByText } = renderWithRouter(
      <Provider store={getStore()}>
        <OverviewPage {...props} />
      </Provider>,
    );
    expect($('.overview-container', container)).to.not.exist;
    expect(document.title).to.equal(
      'Overview Of Your Claim | Veterans Affairs',
    );
    getByText('Claim status is unavailable');
  });

  it('should render null when claim is null', () => {
    const { container, getByText } = renderWithRouter(
      <Provider store={getStore()}>
        <OverviewPage {...props} claim={null} />
      </Provider>,
    );
    expect($('.overview-container', container)).to.not.exist;
    expect(document.title).to.equal(
      'Overview Of Your Claim | Veterans Affairs',
    );
    getByText('Claim status is unavailable');
  });

  context('cstClaimPhases feature flag enabled', () => {
    context('when claim is closed', () => {
      const claim = {
        id: '1',
        attributes: {
          claimDate: '2023-01-01',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2023-01-10',
            latestPhaseType: 'Complete',
            previousPhases: {
              phase7CompleteDate: '2023-01-10',
            },
          },
          closeDate: '2023-01-10',
          decisionLetterSent: false,
          status: 'COMPLETE',
          supportingDocuments: [],
          trackedItems: [],
        },
      };

      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={claim} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header, claim phase diagram and timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={claim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'There are 8 steps in the claim process. It’s common for claims to repeat steps 3 to 6 if we need more information.',
        );
        expect($('.claim-phase-diagram', container)).to.exist;
        expect($('.claim-timeline', container)).to.exist;
      });
    });
    context('when claim is open', () => {
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
          decisionLetterSent: true,
          status: 'UNDER_REVIEW',
          supportingDocuments: [],
          trackedItems: [
            {
              id: 1,
              requestedDate: '2023-02-01',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
            {
              id: 2,
              requestedDate: '2023-02-01',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
          ],
        },
      };

      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage claim={claim} {...props} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header, claim phase diagram and timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={claim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'There are 8 steps in the claim process. It’s common for claims to repeat steps 3 to 6 if we need more information.',
        );
        expect($('.claim-phase-diagram', container)).to.exist;
        expect($('.claim-timeline', container)).to.exist;
      });
    });
  });

  context('cstClaimPhases feature flag enabled', () => {
    context('when claim is closed', () => {
      const claim = {
        id: '1',
        attributes: {
          claimDate: '2023-01-01',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2023-01-10',
            latestPhaseType: 'Complete',
            previousPhases: {
              phase7CompleteDate: '2023-01-10',
            },
          },
          closeDate: '2023-01-10',
          decisionLetterSent: false,
          status: 'COMPLETE',
          supportingDocuments: [],
          trackedItems: [],
        },
      };

      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={claim} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header and timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={claim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );
        expect($('.claim-phase-diagram', container)).to.not.exist;
        expect($('.claim-timeline', container)).to.exist;
      });
    });

    context('when claim is open', () => {
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
          decisionLetterSent: true,
          status: 'UNDER_REVIEW',
          supportingDocuments: [],
          trackedItems: [
            {
              id: 1,
              requestedDate: '2023-02-01',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
            {
              id: 2,
              requestedDate: '2023-02-01',
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Initial review complete Request',
            },
          ],
        },
      };

      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage claim={claim} {...props} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header and timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={claim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );
        expect($('.claim-phase-diagram', container)).to.not.exist;
        expect($('.claim-timeline', container)).to.exist;
      });
    });
  });
});
