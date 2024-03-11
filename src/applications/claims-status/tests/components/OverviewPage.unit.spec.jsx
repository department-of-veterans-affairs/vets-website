import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { OverviewPage } from '../../containers/OverviewPage';

const params = { id: 1 };

describe('<OverviewPage>', () => {
  const store = createStore(() => ({}));

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
      const { container } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            params={params}
            clearNotification={() => {}}
            loading
          />
        </Provider>,
      );
      const overviewSection = $('.overview-container', container);
      expect(overviewSection).to.not.exist;
      expect($('va-loading-indicator', container)).to.exist;
    });

    it('should render overview header and timeline', () => {
      const { container, getByText } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );
      const overviewPage = $('#tabPanelFiles', container);
      expect(overviewPage).to.exist;
      getByText('Overview of the claim process');
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
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
          },
        },
        closeDate: null,
        decisionLetterSent: true,
        status: 'INITIAL_REVIEW',
        supportingDocuments: [],
        trackedItems: [],
      },
    };

    it('should render empty content when loading', () => {
      const { container } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            params={params}
            clearNotification={() => {}}
            loading
          />
        </Provider>,
      );
      const overviewSection = $('.overview-container', container);
      expect(overviewSection).to.not.exist;
      expect($('va-loading-indicator', container)).to.exist;
    });

    it('should render overview header and timeline', () => {
      const { container, getByText } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );
      const overviewPage = $('#tabPanelFiles', container);
      expect(overviewPage).to.exist;
      getByText('Overview of the claim process');
      expect($('.claim-timeline', container)).to.exist;
    });
  });
});
