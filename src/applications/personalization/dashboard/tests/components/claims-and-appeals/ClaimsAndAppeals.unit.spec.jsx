import React from 'react';
import { expect } from 'chai';
import { daysAgo } from '@@profile/tests/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import reducers from '~/applications/personalization/dashboard/reducers';

import ClaimsAndAppeals from '../../../components/claims-and-appeals/ClaimsAndAppeals';
import { claimsAvailability } from '../../../utils/claims-helpers';

function claimsAppealsUser() {
  return {
    profile: {
      services: ['appeals-status', 'evss-claims'],
    },
  };
}

function makeAppealObject({ updateDate, closed = false }) {
  return {
    id: '2765759',
    type: 'legacyAppeal',
    attributes: {
      appealIds: ['2765759'],
      updated: '2021-03-04T19:55:21-05:00',
      incompleteHistory: false,
      type: 'original',
      active: !closed,
      description: 'Benefits as a result of VA error (Section 1151)',
      aod: false,
      location: 'bva',
      aoj: 'vba',
      programArea: 'compensation',
      status: { type: 'on_docket', details: {} },
      alerts: [],
      docket: {
        front: false,
        total: 140135,
        ahead: 101381,
        ready: 16432,
        month: '2012-04-01',
        docketMonth: '2011-01-01',
        eta: null,
      },
      issues: [
        {
          description: 'Benefits as a result of VA error (Section 1151)',
          diagnosticCode: null,
          active: true,
          lastAction: null,
          date: null,
        },
      ],
      events: [
        { type: 'nod', date: '2012-02-02' },
        { type: 'soc', date: '2012-03-03' },
        { type: 'form9', date: '2012-04-04' },
        { type: 'hearing_held', date: updateDate },
      ],
      evidence: [],
    },
  };
}

function makeClaimObject({ claimDate, updateDate, status = 'Claim received' }) {
  return {
    id: '600214206',
    type: 'claim',
    attributes: {
      claimDate: claimDate || '2021-01-21',
      claimPhaseDates: {
        phaseChangeDate: updateDate,
      },
      claimType: 'Compensation',
      closeDate: null,
      decisionLetterSent: false,
      developmentLetterSent: false,
      documentsNeeded: false,
      endProductCode: '404',
      evidenceWaiverSubmitted5103: false,
      lighthouseId: 600214206,
      status,
    },
  };
}

function loadingErrorAlertExists(view) {
  expect(
    view.getByRole('heading', {
      name: /^We can’t access your claims or appeals information$/i,
    }),
  ).to.exist;
  expect(
    view.getByText(
      'We’re sorry. Something went wrong on our end. If you have any claims and appeals, you won’t be able to access your claims and appeals information right now. Please refresh or try again later.',
    ),
  ).to.exist;
}

describe('ClaimsAndAppeals component', () => {
  let view;
  let initialState;

  describe('error states', () => {
    context('when there is an error fetching appeals data', () => {
      beforeEach(() => {
        initialState = {
          user: claimsAppealsUser(),
          claims: {
            appealsLoading: false,
            claimsLoading: false,
            appeals: [],
            claims: [],
            v2Availability: 'ERROR',
          },
        };
        view = renderInReduxProvider(<ClaimsAndAppeals dataLoadingDisabled />, {
          initialState,
          reducers,
        });
      });

      it('should render an error alert', () => {
        expect(view.queryByRole('progressbar')).to.not.exist;
        expect(view.queryByRole('heading', { name: /^claims and appeals$/i }))
          .to.exist;
        loadingErrorAlertExists(view);
      });

      it('should not show a CTA', () => {
        expect(
          view.queryByRole('link', {
            name: /check your claim or appeal status/i,
          }),
        ).to.not.exist;
      });
    });

    context('when there is an error fetching claims data', () => {
      beforeEach(() => {
        initialState = {
          user: claimsAppealsUser(),
          claims: {
            appealsLoading: false,
            claimsLoading: false,
            appeals: [],
            claims: [],
            claimsAvailability: claimsAvailability.UNAVAILABLE,
          },
        };
        view = renderInReduxProvider(<ClaimsAndAppeals dataLoadingDisabled />, {
          initialState,
          reducers,
        });
      });

      it('should render an error alert', () => {
        expect(view.queryByRole('progressbar')).to.not.exist;
        expect(view.queryByRole('heading', { name: /^claims and appeals$/i }))
          .to.exist;
        loadingErrorAlertExists(view);
      });

      it('should not show a CTA', () => {
        expect(
          view.queryByRole('link', {
            name: /check your claim or appeal status/i,
          }),
        ).to.not.exist;
      });
    });
  });

  describe('happy path render logic', () => {
    context('when the user has no claims or appeals on file', () => {
      beforeEach(() => {
        initialState = {
          user: claimsAppealsUser(),
          claims: {
            appealsLoading: false,
            claimsLoading: false,
            appeals: [],
            claims: [],
          },
        };
        view = renderInReduxProvider(<ClaimsAndAppeals dataLoadingDisabled />, {
          initialState,
          reducers,
        });
      });

      it('does not render anything except a headline', () => {
        expect(view.queryByRole('progressbar')).to.not.exist;
        expect(view.queryByRole('heading', { name: /^claims and appeals$/i }))
          .to.exist;
      });
    });

    context(
      'when the user has 3 claims that were all updated in the past 60 days',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            claims: {
              appealsLoading: false,
              claimsLoading: false,
              appeals: [],
              claims: [
                makeClaimObject({
                  updateDate: daysAgo(34),
                  status: 'Evidence gathering, review, and decision',
                }),
                makeClaimObject({
                  updateDate: daysAgo(1),
                  status: 'Preparation for notification',
                }),
                makeClaimObject({ updateDate: daysAgo(15) }),
              ],
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });

        it('shows the CTA', () => {
          expect(view.queryByRole('progressbar')).to.not.exist;
          expect(view.getByRole('heading', { name: /^claims and appeals$/i }))
            .to.exist;
          expect(view.getByRole('link', { name: /^review claim received/i })).to
            .exist;
        });
      },
    );

    context(
      'when the user has 2 claims (1 closed) and 2 appeals (1 closed) that were all updated in the past 60 days',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            claims: {
              appealsLoading: false,
              claimsLoading: false,
              appeals: [
                // closed appeal updated 5 days ago
                makeAppealObject({ updateDate: daysAgo(5), closed: true }),
                // appeal updated one day ago
                makeAppealObject({ updateDate: daysAgo(1) }),
              ],
              claims: [
                // closed claim updated 5 days ago
                makeClaimObject({
                  updateDate: daysAgo(5),
                  status: 'Closed',
                }),
                // open claim updated 40 days ago
                makeClaimObject({
                  updateDate: daysAgo(40),
                  status: 'Preparation for notification',
                }),
              ],
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });

        it('shows the CTA', () => {
          expect(view.queryByRole('progressbar')).to.not.exist;
          expect(view.getByRole('heading', { name: /^claims and appeals$/i }))
            .to.exist;
          expect(view.getByRole('link', { name: /^review details/i })).to.exist;
        });
      },
    );

    context(
      'when user has two open claims (one recently updated), one open appeal, and one closed claim',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            claims: {
              appealsLoading: false,
              claimsLoading: false,
              appeals: [
                // open appeal that changed 31 days ago
                makeAppealObject({ updateDate: daysAgo(31) }),
              ],
              claims: [
                // open claim updated 29 days ago
                makeClaimObject({
                  updateDate: daysAgo(29),
                  status: 'Preparation for notification',
                }),
                // closed claim without recent activity
                makeClaimObject({
                  updateDate: daysAgo(61),
                  status: 'Closed',
                }),
                // open claim without recent activity
                makeClaimObject({
                  updateDate: daysAgo(5),
                  status: 'Claim received',
                }),
              ],
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });

        it('shows the CTA', () => {
          expect(view.queryByRole('progressbar')).to.not.exist;
          expect(view.getByRole('heading', { name: /^claims and appeals$/i }))
            .to.exist;
          expect(
            view.getByRole('link', {
              name: /review claim/i,
            }),
          ).to.exist;
        });

        it('shows details for the most recently updated claim', () => {
          expect(view.getByRole('link', { name: /^review claim received/i })).to
            .exist;
        });
      },
    );

    context(
      'when the user has no open claims or appeals, but does have an appeal that closed within the past 60 days',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            claims: {
              appealsLoading: false,
              claimsLoading: false,
              appeals: [
                // closed appeal that was closed 10 days ago
                makeAppealObject({ updateDate: daysAgo(10), closed: true }),
              ],
              claims: [
                // closed claim with no recent activity
                makeClaimObject({
                  updateDate: daysAgo(3000),
                  status: 'Closed',
                }),
                // closed claim without recent activity
                makeClaimObject({
                  updateDate: daysAgo(31),
                  status: 'Closed',
                }),
              ],
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });

        it('shows the CTA', () => {
          expect(
            view.getByRole('link', {
              name: /review details/i,
            }),
          ).to.exist;
        });

        it('shows details about the recently closed appeal', () => {
          expect(view.getByRole('heading', { name: /updated on/i })).to.exist;
        });
      },
    );

    context(
      'the user has one open appeal that was updated over 60 days ago',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            claims: {
              appealsLoading: false,
              claimsLoading: false,
              appeals: [makeAppealObject({ updateDate: daysAgo(61) })],
              claims: [],
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });

        it('shows the CTA', () => {
          expect(view.getByRole('heading', { name: /^claims and appeals$/i }))
            .to.exist;
          expect(
            view.getByRole('link', {
              name: /review details/i,
            }),
          ).to.exist;
        });

        it('does not show details about the open appeal', () => {
          expect(view.queryByRole('link', { name: /^view details of/i })).to.not
            .exist;
        });
      },
    );

    context(
      'the user only has claims and appeals that closed over 60 days ago',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            claims: {
              appealsLoading: false,
              claimsLoading: false,
              appeals: [
                makeAppealObject({
                  updateDate: daysAgo(1000),
                  closed: true,
                }),
              ],
              claims: [
                makeClaimObject({
                  updateDate: daysAgo(100),
                  status: 'Closed',
                }),
                makeClaimObject({
                  updateDate: daysAgo(85),
                  status: 'Closed',
                }),
                makeClaimObject({
                  updateDate: daysAgo(61),
                  status: 'Closed',
                }),
              ],
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });
      },
    );

    context(
      'the user has claims that closed over 60 days ago and got a 404 from the appeals endpoint because they have no appeals on file',
      () => {
        beforeEach(() => {
          initialState = {
            user: claimsAppealsUser(),
            claims: {
              appealsLoading: false,
              claimsLoading: false,
              appeals: [],
              claimsAvailability: claimsAvailability.UNAVAILABLE,
              claims: [
                makeClaimObject({
                  updateDate: daysAgo(100),
                  status: 'Closed',
                }),
                makeClaimObject({
                  updateDate: daysAgo(85),
                  status: 'Closed',
                }),
                makeClaimObject({
                  updateDate: daysAgo(61),
                  status: 'Closed',
                }),
              ],
            },
          };
          view = renderInReduxProvider(
            <ClaimsAndAppeals dataLoadingDisabled />,
            {
              initialState,
              reducers,
            },
          );
        });

        it('renders the claims and appeals error', () => {
          expect(view.queryByRole('progressbar')).to.not.exist;
          expect(view.getByTestId('dashboard-section-claims-and-appeals-error'))
            .to.exist;
        });
      },
    );
  });
});
