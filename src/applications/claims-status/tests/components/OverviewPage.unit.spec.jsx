import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { OverviewPage } from '../../containers/OverviewPage';
import { renderWithRouter, rerenderWithRouter } from '../utils';

const props = {
  claim: {},
  clearNotification: () => {},
  lastPage: '',
  loading: false,
  message: {},
  params: { id: 1 },
};

const openDependencyClaim = {
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
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
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

const openCompensationClaim = {
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
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
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

const closedCompensationClaim = {
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
    claimType: 'Compensation',
    claimTypeCode: '110LCMP7IDES', // 5103 Notice
    closeDate: '2023-01-10',
    decisionLetterSent: false,
    status: 'COMPLETE',
    supportingDocuments: [],
    trackedItems: [],
  },
};

const closedDependencyClaim = {
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
    claimType: 'Dependency',
    claimTypeCode: '400PREDSCHRG',
    closeDate: '2023-01-10',
    decisionLetterSent: false,
    status: 'COMPLETE',
    supportingDocuments: [],
    trackedItems: [],
  },
};

const openPensionClaim = {
  id: '1',
  type: 'claim',
  attributes: {
    claimTypeCode: '180ORGPENPMC',
    claimDate: '2025-01-23',
    claimPhaseDates: {
      phaseChangeDate: '2025-01-23',
      currentPhaseBack: false,
      latestPhaseType: 'GATHERING_OF_EVIDENCE',
      previousPhases: {
        phase2CompleteDate: '2025-01-23',
        phase1CompleteDate: '2025-01-23',
      },
    },
    claimType: 'Pension',
    closeDate: null,
    contentions: [
      {
        name: 'pension (New)',
      },
      {
        name: 'veteran pension (New)',
      },
    ],
    status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
    trackedItems: [],
    canUpload: true,
  },
};

describe('<OverviewPage>', () => {
  const getStore = (cstClaimPhasesEnabled = true) =>
    createStore(() => ({
      featureToggles: {
        // eslint-disable-next-line camelcase
        cst_claim_phases: cstClaimPhasesEnabled,
      },
      disability: {
        status: {
          notifications: {
            message: null,
            additionalEvidenceMessage: null,
            type1UnknownErrors: null,
          },
        },
      },
    }));

  it('should render error heading and ServiceUnavailableAlert when claim empty', () => {
    const { container, getByText } = renderWithRouter(
      <Provider store={getStore()}>
        <OverviewPage {...props} />
      </Provider>,
    );
    expect($('.overview-container', container)).to.not.exist;
    getByText('We encountered a problem');

    const alertHeading = $('va-alert h2', container);
    expect(alertHeading.textContent).to.equal(
      "We can't access your claim right now",
    );

    const alertBody = $('va-alert p', container);
    expect(alertBody.textContent).to.include(
      "We're sorry. There's a problem with our system.",
    );
  });

  it('should render error heading and ServiceUnavailableAlert when claim is null', () => {
    const { container, getByText } = renderWithRouter(
      <Provider store={getStore()}>
        <OverviewPage {...props} claim={null} />
      </Provider>,
    );
    expect($('.overview-container', container)).to.not.exist;
    getByText('We encountered a problem');

    const alertHeading = $('va-alert h2', container);
    expect(alertHeading.textContent).to.equal(
      "We can't access your claim right now",
    );

    const alertBody = $('va-alert p', container);
    expect(alertBody.textContent).to.include(
      "We're sorry. There's a problem with our system.",
    );
  });

  context('cstClaimPhases feature flag enabled', () => {
    describe('document.title', () => {
      it('should not update document title at mount-time if claim is not available', () => {
        renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} />
          </Provider>,
        );
        expect(document.title).to.equal('');
      });
      it('should update document title with claim details at mount-time if claim is already loaded', () => {
        renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={openDependencyClaim} />
          </Provider>,
        );
        expect(document.title).to.equal(
          'Overview of January 1, 2023 Dependency Claim | Veterans Affairs',
        );
      });
      it('should update document title with claim details after mount once the claim has loaded', () => {
        const { rerender } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} loading />
          </Provider>,
        );
        rerenderWithRouter(
          rerender,
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={openCompensationClaim} />
          </Provider>,
        );
        expect(document.title).to.equal(
          'Overview of January 1, 2023 Compensation Claim | Veterans Affairs',
        );
      });
      it('should update document title with a default message after mount once the claim fails to load', () => {
        const { rerender } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} loading />
          </Provider>,
        );
        rerenderWithRouter(
          rerender,
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={null} />
          </Provider>,
        );
        expect(document.title).to.equal(
          'Overview of Your Claim | Veterans Affairs',
        );
      });
      it('should not update document title after mount if the loading status has not changed', () => {
        const { rerender } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} loading />
          </Provider>,
        );
        rerenderWithRouter(
          rerender,
          <Provider store={getStore()}>
            <OverviewPage
              {...props}
              loading
              message={{ title: 'Test', body: 'Body' }}
            />
          </Provider>,
        );
        expect(document.title).to.equal('');
      });
    });
    context('when claim is closed and disability compensation claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={closedCompensationClaim} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header, claim phase diagram and stepper', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={closedCompensationClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'There are 8 steps in the claim process. It’s common for claims to repeat steps 3 to 6 if we need more information.',
        );
        expect($('.claim-phase-diagram', container)).to.exist;
        expect($('.claim-phase-stepper', container)).to.exist;
        expect($('.claim-timeline', container)).to.not.exist;
      });
    });
    context('when claim is closed and dependency claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={closedDependencyClaim} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render claim timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={closedDependencyClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );

        expect($('.claim-phase-diagram', container)).to.not.exist;
        expect($('.claim-phase-stepper', container)).to.not.exist;
        expect($('va-process-list', container)).to.exist;
      });
    });
    context('when claim is open and disability compensation claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage claim={openCompensationClaim} {...props} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header, claim phase diagram and stepper', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={openCompensationClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'There are 8 steps in the claim process. It’s common for claims to repeat steps 3 to 6 if we need more information.',
        );
        expect($('.claim-phase-diagram', container)).to.exist;
        expect($('.claim-phase-stepper', container)).to.exist;
        expect($('.claim-timeline', container)).to.not.exist;
      });
    });
    context('when claim is open and pension claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage claim={openPensionClaim} {...props} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header, claim phase diagram and stepper', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={openPensionClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Veterans Pension benefits claim process');
        getByText(
          'There are 8 steps in the claim process. You may need to repeat steps 3 to 6 if we need more information.',
        );
        expect($('.claim-phase-diagram', container)).to.exist;
        expect($('.claim-phase-stepper', container)).to.exist;
        expect($('.claim-timeline', container)).to.not.exist;
      });
    });
    context('when claim is open and dependency compensation claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage claim={openDependencyClaim} {...props} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render claim timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore()}>
            <OverviewPage {...props} claim={openDependencyClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );
        expect($('.claim-phase-diagram', container)).to.not.exist;
        expect($('.claim-phase-stepper', container)).to.not.exist;
        expect($('va-process-list', container)).to.exist;
      });
    });
  });

  context('cstClaimPhases feature flag disabled', () => {
    context('when claim is closed and disability compensation claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={closedCompensationClaim} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header and timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={closedCompensationClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );
        expect($('.claim-phase-diagram', container)).to.not.exist;
        expect($('.claim-phase-stepper', container)).to.not.exist;
        expect($('va-process-list', container)).to.exist;
      });
    });
    context('when claim is closed and dependency compensation claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={closedDependencyClaim} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header and timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={closedDependencyClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );
        expect($('.claim-phase-diagram', container)).to.not.exist;
        expect($('.claim-phase-stepper', container)).to.not.exist;
        expect($('va-process-list', container)).to.exist;
      });
    });
    context('when claim is open and disability compensation claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage claim={openCompensationClaim} {...props} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header and timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={openCompensationClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );
        expect($('.claim-phase-diagram', container)).to.not.exist;
        expect($('.claim-phase-stepper', container)).to.not.exist;
        expect($('va-process-list', container)).to.exist;
      });
    });
    context('when claim is open and dependency compensation claim', () => {
      it('should render empty content when loading', () => {
        const { container } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage claim={openDependencyClaim} {...props} loading />
          </Provider>,
        );
        const overviewSection = $('.overview-container', container);
        expect(overviewSection).to.not.exist;
        expect($('va-loading-indicator', container)).to.exist;
      });

      it('should render overview header and timeline', () => {
        const { container, getByText } = renderWithRouter(
          <Provider store={getStore(false)}>
            <OverviewPage {...props} claim={openDependencyClaim} />
          </Provider>,
        );
        const overviewPage = $('#tabPanelFiles', container);
        expect(overviewPage).to.exist;
        getByText('Overview of the claim process');
        getByText(
          'Learn about the VA claim process and what happens after you file your claim.',
        );
        expect($('.claim-phase-diagram', container)).to.not.exist;
        expect($('.claim-phase-stepper', container)).to.not.exist;
        expect($('va-process-list', container)).to.exist;
      });
    });
  });
});
