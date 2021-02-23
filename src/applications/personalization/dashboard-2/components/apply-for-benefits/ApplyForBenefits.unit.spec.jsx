import React from 'react';
import { expect } from 'chai';

import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import reducers from '~/applications/personalization/dashboard/reducers';
import ApplyForBenefits from './ApplyForBenefits';

const oneDayInMS = 24 * 60 * 60 * 1000;
const oneWeekInMS = oneDayInMS * 7;
const oneYearInMS = oneDayInMS * 365;

function oneDayAgo() {
  return Date.now() - oneDayInMS;
}

function oneDayFromNow() {
  return Date.now() + oneDayInMS;
}

function oneWeekFromNow() {
  return Date.now() + oneWeekInMS;
}

function oneYearFromNow() {
  return Date.now() + oneYearInMS;
}

describe('ApplyForBenefits component', () => {
  let view;
  it('renders the correct content when there are no applications in progress', () => {
    const initialState = {
      user: {
        profile: {
          savedForms: [],
        },
      },
    };
    view = renderInReduxProvider(<ApplyForBenefits />, {
      initialState,
      reducers,
    });
    expect(view.findByText(/you have no applications in progress/)).to.exist;
  });

  it('does not render unknown applications that are in progress', () => {
    const initialState = {
      hcaEnrollmentStatus: { enrollmentStatus: null, hasServerError: false },
      user: {
        profile: {
          savedForms: [
            {
              form: '123-ABC',
              metadata: {
                version: 3,
                returnUrl: '/military/reserve-national-guard',
              },
              lastUpdated: oneDayAgo(),
            },
          ],
        },
      },
    };
    view = renderInReduxProvider(<ApplyForBenefits />, {
      initialState,
      reducers,
    });
    expect(view.findByText(/you have no applications in progress/)).to.exist;
  });

  it('sorts the in-progress applications, listing the soonest-to-expire applications first', () => {
    const initialState = {
      user: {
        profile: {
          savedForms: [
            {
              form: '686C-674',
              metadata: {
                version: 1,
                returnUrl: '/net-worth',
                savedAt: oneDayAgo(),
                submission: {
                  status: false,
                  errorMessage: false,
                  id: false,
                  timestamp: false,
                  hasAttemptedSubmit: false,
                },
                expiresAt: oneWeekFromNow() / 1000,
                lastUpdated: oneDayAgo() / 1000,
                inProgressFormId: 5179,
              },
              lastUpdated: oneDayAgo() / 1000,
            },
            {
              form: '21-526EZ',
              metadata: {
                version: 1,
                returnUrl: '/net-worth',
                savedAt: oneDayAgo(),
                submission: {
                  status: false,
                  errorMessage: false,
                  id: false,
                  timestamp: false,
                  hasAttemptedSubmit: false,
                },
                expiresAt: oneDayFromNow() / 1000,
                lastUpdated: oneDayAgo() / 1000,
                inProgressFormId: 5179,
              },
              lastUpdated: oneDayAgo() / 1000,
            },
            {
              form: '1010ez',
              metadata: {
                version: 1,
                returnUrl: '/net-worth',
                savedAt: oneDayAgo(),
                submission: {
                  status: false,
                  errorMessage: false,
                  id: false,
                  timestamp: false,
                  hasAttemptedSubmit: false,
                },
                expiresAt: oneYearFromNow() / 1000,
                lastUpdated: oneDayAgo() / 1000,
                inProgressFormId: 5179,
              },
              lastUpdated: oneDayAgo() / 1000,
            },
          ],
        },
      },
    };
    view = renderInReduxProvider(<ApplyForBenefits />, {
      initialState,
      reducers,
    });
    expect(view.queryByText(/you have no applications in progress/)).not.to
      .exist;
    const applicationsInProgress = view.getAllByTestId(
      'application-in-progress',
    );
    expect(applicationsInProgress.length).to.equal(3);
    expect(applicationsInProgress[0]).to.contain.text('21-526EZ');
    expect(applicationsInProgress[1]).to.contain.text('686C-674');
    expect(applicationsInProgress[2]).to.contain.text('1010ez');
  });
});
