import React from 'react';
import SkinDeep from 'skin-deep';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { ClaimStatusPage } from '../../containers/ClaimStatusPage';
import { renderWithRouter } from '../utils';

const params = { id: 1 };

const props = {
  claim: {},
  clearNotification: () => {},
  lastloading: '',
  loading: false,
  message: {},
  showClaimLettersLink: false,
};

const getStore = (cstUseClaimDetailsV2Enabled = true) =>
  createStore(() => ({
    featureToggles: {
      // eslint-disable-next-line camelcase
      cst_use_claim_details_v2: cstUseClaimDetailsV2Enabled,
    },
  }));

describe('<ClaimStatusPage>', () => {
  it('should render null when there are no claims', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimStatusPage {...props} params={params} />,
    );
    expect(document.title).to.equal('Status Of Your Claim | Veterans Affairs');
    expect($('.claim-status', container)).to.not.exist;
    getByText('Claim status is unavailable');
  });

  it('should render null when claim is null', () => {
    const { container, getByText } = renderWithRouter(
      <ClaimStatusPage {...props} claim={null} params={params} />,
    );
    expect(document.title).to.equal('Status Of Your Claim | Veterans Affairs');
    expect($('.claim-status', container)).to.not.exist;
    getByText('Claim status is unavailable');
  });

  context('cstUseClaimDetailsV2 feature flag enabled', () => {
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
                  latestPhaseType: 'UNDER_REVIEW',
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
                  {
                    id: 2,
                    requestedDate: '2023-02-01',
                    status: 'INITIAL_REVIEW_COMPLETE',
                    displayName: 'Initial review complete Request',
                  },
                ],
              },
            };

            const { container, getByText } = renderWithRouter(
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
            expect(document.title).to.equal(
              'Status Of January 1, 2023 Disability Compensation Claim | Veterans Affairs',
            );
            expect($('va-process-list', container)).not.to.exist;
            expect($('.claim-status-header-container', container)).to.exist;
            expect($('.what-were-doing-container', container)).to.exist;
            getByText('What you need to do');
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
            const { container, getByText } = renderWithRouter(
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
            expect(document.title).to.equal(
              'Status Of January 1, 2023 Disability Compensation Claim | Veterans Affairs',
            );
            expect($('va-process-list', container)).not.to.exist;
            expect($('.claim-status-header-container', container)).to.exist;
            expect($('.what-were-doing-container', container)).to.exist;
            getByText('What you need to do');
            expect($('.recent-activity-container', container)).to.exist;
            expect($('va-alert', container)).to.exist;
          });
        },
      );
    });
  });

  context('when feature flags disabled', () => {
    it('should not render need files from you when closed', () => {
      const claim = {
        id: '1',
        type: 'claim',
        attributes: {
          claimDate: '2023-01-01',
          claimPhaseDates: {
            currentPhaseBack: false,
            phaseChangeDate: '2023-12-12',
            latestPhaseType: 'INITIAL_REVIEW',
            previousPhases: {
              phase7CompleteDate: '2023-12-12',
            },
          },
          closeDate: '2023-12-12',
          documentsNeeded: false,
          decisionLetterSent: false,
          status: 'INITIAL_REVIEW',
          supportingDocuments: [],
          trackedItems: [
            {
              id: 1,
              status: 'ACCEPTED',
              displayName: 'Test',
              description: 'Test',
              suspenseDate: '2024-02-01',
              date: '2023-01-01',
            },
            {
              id: 2,
              status: 'INITIAL_REVIEW_COMPLETE',
              displayName: 'Test',
              description: 'Test',
              suspenseDate: '2024-02-01',
              date: '2023-01-01',
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
        id: '1',
        type: 'claim',
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
          documentsNeeded: true,
          decisionLetterSent: true,
          status: 'INITIAL_REVIEW',
          supportingDocuments: [
            {
              id: '123456',
              originalFileName: 'test.pdf',
              documentTypeLabel: 'Buddy / Lay Statement',
              uploadDate: '2023-03-04',
            },
          ],
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

      const tree = SkinDeep.shallowRender(
        <ClaimStatusPage claim={claim} params={params} />,
      );
      expect(tree.subTree('NeedFilesFromYou')).to.be.false;
    });

    it('should render empty content when loading', () => {
      const { container } = renderWithRouter(
        <ClaimStatusPage {...props} loading params={params} />,
      );
      expect($('.claim-status', container)).to.not.exist;
      expect($('va-loading-indicator', container)).to.exist;
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
        id: '1',
        type: 'claim',
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
          documentsNeeded: false,
          decisionLetterSent: false,
          status: 'INITIAL_REVIEW',
          supportingDocuments: [
            {
              id: '123456',
              originalFileName: 'test.pdf',
              documentTypeLabel: 'Buddy / Lay Statement',
              uploadDate: '2023-03-04',
            },
          ],
          trackedItems: [],
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
        id: '1',
        type: 'claim',
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
          documentsNeeded: false,
          decisionLetterSent: false,
          status: 'INITIAL_REVIEW',
          supportingDocuments: [
            {
              id: '123456',
              originalFileName: 'test.pdf',
              documentTypeLabel: 'Buddy / Lay Statement',
              uploadDate: '2023-03-04',
            },
          ],
          trackedItems: [],
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

  context('DDL feature flag is enabled', () => {
    const claim = {
      id: '1',
      type: 'claim',
      attributes: {
        claimDate: '2023-01-01',
        claimPhaseDates: {
          currentPhaseBack: false,
          phaseChangeDate: '2023-12-12',
          latestPhaseType: 'GATHERING_OF_EVIDENCE',
          previousPhases: {
            phase7CompleteDate: '2023-12-12',
          },
        },
        closeDate: '2023-12-12',
        documentsNeeded: true,
        decisionLetterSent: true,
        status: 'COMPLETE',
        supportingDocuments: [],
        trackedItems: [
          {
            id: 1,
            displayName: 'Test',
            description: 'Test',
            status: 'NEEDED_FROM_YOU',
          },
        ],
      },
    };

    const store = createStore(() => ({}));

    it('should render a link to the claim letters page when using Lighthouse', () => {
      const screen = renderWithRouter(
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
});
