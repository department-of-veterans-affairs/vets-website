import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { OverviewPage } from '../../containers/OverviewPage';

const params = { id: 1 };

describe('<OverviewPage>', () => {
  const store = createStore(() => ({}));

  context('DDL feature flag is enabled', () => {
    const claim = {
      attributes: {
        open: false,
        decisionLetterSent: true,
      },
    };

    it('should render a link to the claim letters page when using Lighthouse', () => {
      const screen = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            useLighthouse
            showClaimLettersLink
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );

      screen.getByText('Get your claim letters');
    });

    it('should render a link to the claim letters page when using EVSS', () => {
      const screen = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            showClaimLettersLink
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );

      screen.getByText('Get your claim letters');
    });
  });

  context('when claim is closed', () => {
    const claim = {
      id: '1',
      attributes: {
        supportingDocuments: [],
        claimDate: '2023-01-01',
        closeDate: '2023-01-10',
        documentsNeeded: true,
        decisionLetterSent: false,
        status: 'COMPLETE',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-01-10',
          latestPhaseType: 'Complete',
          previousPhases: {
            phase1CompleteDate: 'null',
          },
        },
      },
    };

    it('should not render a need files from you alert, claim decision alert, or timeline', () => {
      const { container, queryByText } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            useLighthouse
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );
      const overviewPage = $('#tabPanelFiles', container);
      expect(overviewPage).to.exist;
      expect(queryByText('View Details')).not.to.exist;
      expect(queryByText('You can download your decision letter online now.'))
        .not.to.exist;
      expect($('.claim-timeline', container)).not.to.exist;
    });

    it('should render overview header and claim complete alert', () => {
      const { container, getByText, queryByText } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            useLighthouse
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );
      const overviewPage = $('#tabPanelFiles', container);
      expect(overviewPage).to.exist;
      getByText('Overview of the claim process');
      expect(queryByText('We decided your claim on January 10, 2023')).to.exist;
    });
  });

  context('when decisionLetterSent is true', () => {
    const claim = {
      id: '1',
      attributes: {
        supportingDocuments: [],
        claimDate: '2023-01-01',
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: true,
        status: 'INITIAL_REVIEW',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2015-01-01',
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
            phase2CompleteDate: '2023-02-08',
          },
        },
        trackedItems: [],
      },
    };

    it('should not render a need files from you alert, claim decision alert, or complete alert', () => {
      const { container, queryByText } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            useLighthouse
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );

      const overviewPage = $('#tabPanelFiles', container);
      expect(overviewPage).to.exist;
      expect(queryByText('View Details')).not.to.exist;
      expect(queryByText('We decided your claim')).not.to.exist;
      expect(queryByText('You can download your decision letter online now.'))
        .not.to.exist;
      expect(queryByText('We decided your claim on January 10, 2023')).not.to
        .exist;
    });

    it('should render overview header and timeline', () => {
      const { container, getByText } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            useLighthouse
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

  context('when documentsNeeded is false', () => {
    const claim = {
      id: '1',
      attributes: {
        supportingDocuments: [],
        claimDate: '2023-01-01',
        closeDate: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        status: 'INITIAL_REVIEW',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2015-01-01',
          latestPhaseType: 'INITIAL_REVIEW',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
            phase2CompleteDate: '2023-02-08',
          },
        },
        trackedItems: [],
      },
    };
    it('should render page with no alerts and a timeline', () => {
      const { container, getByText, queryByText } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            useLighthouse
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );

      const overviewPage = $('#tabPanelFiles', container);
      expect(overviewPage).to.exist;
      getByText('Overview of the claim process');
      expect(queryByText('View Details')).not.to.exist;
      expect(queryByText('We decided your claim')).not.to.exist;
      expect(queryByText('You can download your decision letter online now.'))
        .not.to.exist;
      expect($('.claim-timeline', container)).to.exist;
    });
  });

  context('when documentsNeeded is true', () => {
    const claim = {
      id: '1',
      attributes: {
        supportingDocuments: [],
        claimDate: '2023-01-01',
        closeDate: null,
        documentsNeeded: true,
        decisionLetterSent: false,
        status: 'EVIDENCE_GATHERING_REVIEW_DECISION',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2015-01-02',
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
          previousPhases: {
            phase1CompleteDate: '2023-02-08',
            phase2CompleteDate: '2023-02-08',
          },
        },
        trackedItems: [
          {
            id: 1,
            status: 'NEEDED_FROM_YOU',
            displayName: 'Test',
            description: 'Test',
            suspenseDate: '2024-02-01',
            date: '2023-01-01',
          },
        ],
      },
    };

    it('should render need files from you component', () => {
      const { container, getByText, queryByText } = render(
        <Provider store={store}>
          <OverviewPage
            claim={claim}
            useLighthouse
            params={params}
            clearNotification={() => {}}
          />
        </Provider>,
      );

      const overviewPage = $('#tabPanelFiles', container);
      expect(overviewPage).to.exist;
      getByText('Overview of the claim process');
      expect(queryByText('View Details')).to.exist;
      expect(queryByText('We decided your claim')).not.to.exist;
      expect(queryByText('You can download your decision letter online now.'))
        .not.to.exist;
      expect($('.claim-timeline', container)).to.exist;
    });
  });

  it('should not render timeline without a phase', () => {
    const claim = {
      attributes: {
        phase: null,
        documentsNeeded: false,
        decisionLetterSent: false,
        waiverSubmitted: true,
        eventsTimeline: [
          {
            type: 'still_need_from_you_list',
            status: 'NEEDED',
          },
        ],
      },
    };

    const tree = SkinDeep.shallowRender(
      <OverviewPage claim={claim} params={params} />,
    );
    expect(tree.everySubTree('ClaimsTimeline')).to.be.empty;
  });

  it('should render empty content when loading', () => {
    const claim = {};

    const tree = SkinDeep.shallowRender(
      <OverviewPage loading claim={claim} params={params} />,
    );
    expect(tree.props.children).to.be.null;
  });

  it('should render notification', () => {
    const claim = {};

    const tree = SkinDeep.shallowRender(
      <OverviewPage
        loading
        params={params}
        message={{ title: 'Test', body: 'Body' }}
        claim={claim}
      />,
    );
    expect(tree.props.message).not.to.be.null;
  });

  it('should clear alert', () => {
    const claim = {
      attributes: {
        eventsTimeline: [],
      },
    };
    const clearNotification = sinon.spy();
    const message = {
      title: 'Test',
      body: 'Test',
    };

    const tree = SkinDeep.shallowRender(
      <OverviewPage
        params={params}
        clearNotification={clearNotification}
        message={message}
        claim={claim}
      />,
    );
    expect(clearNotification.called).to.be.false;
    tree.subTree('ClaimDetailLayout').props.clearNotification();
    expect(clearNotification.called).to.be.true;
  });

  it('should clear notification when leaving', () => {
    const claim = {
      attributes: {
        eventsTimeline: [],
      },
    };
    const clearNotification = sinon.spy();
    const message = {
      title: 'Test',
      body: 'Test',
    };

    const tree = SkinDeep.shallowRender(
      <OverviewPage
        params={params}
        clearNotification={clearNotification}
        message={message}
        claim={claim}
      />,
    );
    expect(clearNotification.called).to.be.false;
    tree.getMountedInstance().componentWillUnmount();
    expect(clearNotification.called).to.be.true;
  });
});
