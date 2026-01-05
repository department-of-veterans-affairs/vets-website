import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import { ClaimStatusPage } from '../../containers/ClaimStatusPage';
import { renderWithRouter, rerenderWithRouter } from '../utils';

const params = { id: 1 };

const props = {
  claim: {},
  clearNotification: () => {},
  lastloading: '',
  loading: false,
  message: {},
  showClaimLettersLink: false,
};

const getStore = (decisionRequested = false) =>
  createStore(() => ({
    disability: {
      status: {
        claimAsk: {
          decisionRequested, // Added since WhatYouNeedToDo section looks for this
        },
        notifications: {
          message: null,
          additionalEvidenceMessage: null,
          type1UnknownErrors: null,
        },
      },
    },
  }));

describe('<ClaimStatusPage>', () => {
  describe('when claim is null', () => {
    it('should render error heading and ServiceUnavailableAlert', () => {
      const { container, getByText } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} claim={null} params={params} />
        </Provider>,
      );
      expect($('.claim-status', container)).to.not.exist;
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
  });

  describe('when there are no claims', () => {
    it('should render error heading and ServiceUnavailableAlert', () => {
      const { container, getByText } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} params={params} />
        </Provider>,
      );
      expect($('.claim-status', container)).to.not.exist;
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
  });

  describe('document.title', () => {
    // Minimum data needed for these test cases.
    const claim = {
      attributes: {
        claimDate: '2024-09-04',
        claimType: 'Compensation',
        claimPhaseDates: {
          previousPhases: {},
        },
        trackedItems: [],
      },
    };
    it('should not update document title at mount-time if claim is not available', () => {
      renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} params={params} />
        </Provider>,
      );
      expect(document.title).to.equal('');
    });
    it('should update document title with claim details at mount-time if claim is already loaded', () => {
      renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} claim={claim} params={params} />
        </Provider>,
      );
      expect(document.title).to.equal(
        'Status of September 4, 2024 Compensation Claim | Veterans Affairs',
      );
    });
    it('should update document title with claim details after mount once the claim has loaded', () => {
      const { rerender } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} loading params={params} />
        </Provider>,
      );
      rerenderWithRouter(
        rerender,
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} claim={claim} params={params} />
        </Provider>,
      );
      expect(document.title).to.equal(
        'Status of September 4, 2024 Compensation Claim | Veterans Affairs',
      );
    });
    it('should update document title with a default message after mount once the claim fails to load', () => {
      const { rerender } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} loading params={params} />
        </Provider>,
      );
      rerenderWithRouter(
        rerender,
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} claim={null} params={params} />
        </Provider>,
      );
      expect(document.title).to.equal(
        'Status of Your Claim | Veterans Affairs',
      );
    });
    it('should not update document title after mount if the loading status has not changed', () => {
      const { rerender } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} loading params={params} />
        </Provider>,
      );
      rerenderWithRouter(
        rerender,
        <Provider store={getStore()}>
          <ClaimStatusPage
            {...props}
            loading
            message={{ title: 'Test', body: 'Body' }}
            params={params}
          />
        </Provider>,
      );
      expect(document.title).to.equal('');
    });
    it('should focus on h1 after render', () => {
      const { rerender, container } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} loading params={params} />
        </Provider>,
      );
      rerenderWithRouter(
        rerender,
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} claim={claim} params={params} />
        </Provider>,
      );
      expect(document.activeElement).to.equal($('h1', container));
    });
  });

  describe('page rendering', () => {
    context('when claim is open', () => {
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
              'Status of January 1, 2023 Disability Compensation Claim | Veterans Affairs',
            );
            expect($('.claim-status-header-container', container)).to.exist;
            expect($('.what-were-doing-container', container)).to.exist;
            getByText('What you need to do');
            expect($('.recent-activity-container', container)).to.exist;
            expect($('va-alert .primary-alert', container)).not.to.exist;
            expect($('va-alert p', container).textContent).to.equal(
              "We can't show all of the details of your claim. Please check back later.",
            );
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
              'Status of January 1, 2023 Disability Compensation Claim | Veterans Affairs',
            );
            expect($('.claim-status-header-container', container)).to.exist;
            expect($('.what-were-doing-container', container)).to.exist;
            getByText('What you need to do');
            expect($('.recent-activity-container', container)).to.exist;
            expect($('va-alert h4', container).textContent).to.equal(
              'Request for evidence',
            );
            expect($('va-alert p', container).textContent).to.equal(
              "We can't show all of the details of your claim. Please check back later.",
            );
          });
        },
      );
    });
  });

  context('when claim is closed', () => {
    it('should render ClosedClaimAlert, Payments and NextSteps', () => {
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

      const { getByTestId, queryByText } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage
            claim={claim}
            params={params}
            clearNotification={() => {}}
          />
          ,
        </Provider>,
      );
      getByTestId('closed-claim-alert');
      getByTestId('payments');
      getByTestId('next-steps');
      expect(queryByText('What you need to do')).to.not.exist;
      expect(
        queryByText(
          'We mailed you a decision letter. It should arrive within 10 days after the date we decided your claim. It can sometimes take longer.',
        ),
      ).to.exist;
    });

    it('should render ClosedClaimAlert with decision letter text, Payments and NextSteps', () => {
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
          decisionLetterSent: true,
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

      const { getByTestId, queryByText } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage
            claim={claim}
            params={params}
            clearNotification={() => {}}
          />
          ,
        </Provider>,
      );
      getByTestId('closed-claim-alert');
      getByTestId('payments');
      getByTestId('next-steps');
      expect(queryByText('What you need to do')).to.not.exist;
      expect(
        queryByText(
          'You can download your decision letter online now. You can also get other letters related to your claims.',
        ),
      ).to.exist;
      expect(queryByText('Get your claim letters')).to.exist;
    });
  });

  context('when loading', () => {
    it('should render empty content', () => {
      const { container } = renderWithRouter(
        <Provider store={getStore()}>
          <ClaimStatusPage {...props} loading params={params} />
        </Provider>,
      );
      expect($('.claim-status', container)).to.not.exist;
      expect($('va-loading-indicator', container)).to.exist;
    });
  });

  describe('alert', () => {
    context('when component unmounts', () => {
      it('should clear alert when component unmounts', () => {
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
        const message = {
          title: 'Test',
          body: 'Test',
        };
        const clearNotification = sinon.spy();
        const { unmount } = renderWithRouter(
          <Provider store={getStore()}>
            <ClaimStatusPage
              params={params}
              clearNotification={clearNotification}
              message={message}
              claim={claim}
            />
          </Provider>,
        );
        unmount();
        expect(clearNotification.called).to.be.true;
      });
    });
  });
});
