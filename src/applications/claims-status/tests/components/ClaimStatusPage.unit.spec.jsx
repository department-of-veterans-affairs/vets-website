import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { ClaimStatusPage } from '../../containers/ClaimStatusPage';

const params = { id: 1 };

describe('<ClaimStatusPage>', () => {
  it('should render page with no alerts and a timeline', () => {
    const claim = {
      attributes: {
        phase: 2,
        open: true,
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
      <ClaimStatusPage claim={claim} params={params} />,
    );
    const content = tree.dive(['ClaimStatusPageContent']);
    expect(content.subTree('NeedFilesFromYou')).to.be.false;
    expect(content.subTree('ClaimsDecision')).to.be.false;
    expect(content.subTree('ClaimsTimeline')).not.to.be.false;
  });

  it('should not render a timeline when closed', () => {
    const claim = {
      attributes: {
        phase: 2,
        open: false,
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
      <ClaimStatusPage claim={claim} params={params} />,
    );
    const content = tree.dive(['ClaimStatusPageContent']);
    expect(content.subTree('ClaimsDecision')).to.be.false;
    expect(content.subTree('ClaimComplete')).not.to.be.false;
    expect(content.subTree('ClaimsTimeline')).to.be.false;
  });

  context('cstUseClaimDetailsV2 feature flag enabled', () => {
    const getStore = (cstUseClaimDetailsV2Enabled = true) =>
      createStore(() => ({
        featureToggles: {
          // eslint-disable-next-line camelcase
          cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
        },
      }));

    context('should render status page without a timeline', () => {
      context(
        'shows ClaimStatusHeader, WhatWereDoing, WhatYouNeedToDo and RecentActivity sections',
        () => {
          it('it shows without alerts when using lighthouse', () => {
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
                trackedItems: [
                  {
                    id: 1,
                    requestedDate: '2023-02-01',
                    status: 'INITIAL_REVIEW_COMPLETE',
                    displayName: 'Initial review complete Request',
                  },
                ],
              },
            };
            const { container } = render(
              <Provider store={getStore()}>
                <ClaimStatusPage
                  useLighthouse
                  claim={claim}
                  params={params}
                  clearNotification={() => {}}
                />
                ,
              </Provider>,
            );
            const statusPage = $('#tabPanelStatus', container);

            expect(statusPage).to.exist;
            expect($('.claim-timeline', container)).not.to.exist;
            expect($('.claim-status-header-container', container)).to.exist;
            expect($('.what-were-doing-container', container)).to.exist;
            expect($('.what-you-need-to-do-container', container)).to.exist;
            expect($('.recent-activity-container', container)).to.exist;
            expect($('va-alert', container)).not.to.exist;
            expect($('.need-files-alert', container)).not.to.exist;
          });

          it('it shows with alerts when using lighthouse', () => {
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
                  phaseChangeDate: '2015-01-01',
                  latestPhaseType: 'INITIAL_REVIEW',
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
                    requestedDate: '2024-02-01',
                    date: '2023-01-01',
                  },
                ],
              },
            };
            const { container } = render(
              <Provider store={getStore()}>
                <ClaimStatusPage
                  useLighthouse
                  claim={claim}
                  params={params}
                  clearNotification={() => {}}
                />
                ,
              </Provider>,
            );
            const statusPage = $('#tabPanelStatus', container);

            expect(statusPage).to.exist;
            expect($('.claim-timeline', container)).not.to.exist;
            expect($('.claim-status-header-container', container)).to.exist;
            expect($('.what-were-doing-container', container)).to.exist;
            expect($('.what-you-need-to-do-container', container)).to.exist;
            expect($('.recent-activity-container', container)).to.exist;
            expect($('va-alert', container)).to.exist;
          });
        },
      );

      context(
        'doesnt show ClaimStatusHeader, WhatWereDoing or RecentActivity sections',
        () => {
          it('shows WhatYouNeedToDo section without alerts when using evss', () => {
            const claim = {
              id: '1',
              attributes: {
                open: true,
                phase: 3,
                dateFiled: '2023-01-01',
                documentsNeeded: true,
                decisionLetterSent: false,
                eventsTimeline: [],
              },
            };
            const { container } = render(
              <Provider store={getStore()}>
                <ClaimStatusPage
                  claim={claim}
                  params={params}
                  clearNotification={() => {}}
                />
                ,
              </Provider>,
            );
            const statusPage = $('#tabPanelStatus', container);

            expect(statusPage).to.exist;
            expect(within(statusPage).queryByRole('list')).to.not.exist;
            expect($('.claim-status-header-container', container)).to.not.exist;
            expect($('.what-were-doing-container', container)).to.not.exist;
            expect($('.what-you-need-to-do-container', container)).to.exist;
            expect($('.recent-activity-container', container)).to.not.exist;
            expect($('va-alert', container)).not.to.exist;
            expect($('.need-files-alert', container)).not.to.exist;
          });
        },
      );
    });

    context('should render status page with a timeline', () => {
      context(
        'doesnt show ClaimStatusHeader, WhatWereDoing or RecentActivity sections',
        () => {
          it('shows WhatYouNeedToDo section with alerts when using evss', () => {
            const claim = {
              id: '1',
              attributes: {
                open: true,
                phase: 3,
                dateFiled: '2023-01-01',
                documentsNeeded: true,
                decisionLetterSent: false,
                eventsTimeline: [
                  {
                    trackedItemId: 1,
                    type: 'still_need_from_you_list',
                    status: 'NEEDED',
                    displayName: 'Test',
                    description: 'Test',
                    suspenseDate: '2024-02-01',
                    date: '2023-01-01',
                  },
                ],
              },
            };
            const test = getStore();

            const { container } = render(
              <Provider store={test}>
                <ClaimStatusPage
                  claim={claim}
                  params={params}
                  clearNotification={() => {}}
                />
                ,
              </Provider>,
            );
            const statusPage = $('#tabPanelStatus', container);

            expect(statusPage).to.exist;
            expect(within(statusPage).queryByRole('list')).to.not.exist;
            expect($('.claim-status-header-container', container)).to.not.exist;
            expect($('.what-were-doing-container', container)).to.not.exist;
            expect($('.what-you-need-to-do-container', container)).to.exist;
            expect($('.recent-activity-container', container)).to.not.exist;
            expect($('va-alert', container)).to.exist;
            expect($('.need-files-alert', container)).not.to.exist;
          });
        },
      );
    });
  });

  context('DDL feature flag is enabled', () => {
    const claim = {
      attributes: {
        open: false,
        decisionLetterSent: true,
      },
    };

    const store = createStore(() => ({}));

    it('should render a link to the claim letters page when using Lighthouse', () => {
      const screen = render(
        <Provider store={store}>
          <ClaimStatusPage
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
          <ClaimStatusPage
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

  it('should not render ClaimComplete with decision letter', () => {
    const claim = {
      attributes: {
        phase: 2,
        open: false,
        documentsNeeded: false,
        decisionLetterSent: true,
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
      <ClaimStatusPage claim={claim} params={params} />,
    );
    const content = tree.dive(['ClaimStatusPageContent']);
    expect(content.subTree('ClaimsDecision')).to.exist;
    expect(content.subTree('ClaimComplete')).to.be.false;
    expect(content.subTree('ClaimsTimeline')).to.be.false;
  });

  it('should render need files from you component', () => {
    const claim = {
      attributes: {
        phase: 2,
        documentsNeeded: true,
        open: true,
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
      <ClaimStatusPage claim={claim} params={params} />,
    );
    const content = tree.dive(['ClaimStatusPageContent']);
    expect(content.subTree('NeedFilesFromYou')).not.to.be.false;
  });

  it('should not render need files from you when closed', () => {
    const claim = {
      attributes: {
        phase: 2,
        documentsNeeded: true,
        decisionLetterSent: false,
        open: false,
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
      <ClaimStatusPage claim={claim} params={params} />,
    );
    expect(tree.subTree('NeedFilesFromYou')).to.be.false;
  });

  it('should not render files needed from you when decision letter sent', () => {
    const claim = {
      attributes: {
        phase: 2,
        documentsNeeded: true,
        decisionLetterSent: true,
        open: true,
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
      <ClaimStatusPage claim={claim} params={params} />,
    );
    expect(tree.subTree('NeedFilesFromYou')).to.be.false;
  });

  it('should render claims decision alert', () => {
    const claim = {
      attributes: {
        phase: 5,
        documentsNeeded: false,
        decisionLetterSent: true,
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
      <ClaimStatusPage claim={claim} params={params} />,
    );
    const content = tree.dive(['ClaimStatusPageContent']);
    expect(content.everySubTree('ClaimsDecision')).not.to.be.empty;
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
      <ClaimStatusPage claim={claim} params={params} />,
    );
    expect(tree.everySubTree('ClaimsTimeline')).to.be.empty;
  });

  it('should render empty content when loading', () => {
    const claim = {};

    const tree = SkinDeep.shallowRender(
      <ClaimStatusPage loading claim={claim} params={params} />,
    );
    expect(tree.props.children).to.be.null;
  });

  it('should render notification', () => {
    const claim = {};

    const tree = SkinDeep.shallowRender(
      <ClaimStatusPage
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
      <ClaimStatusPage
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
      <ClaimStatusPage
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
