import React from 'react';
import { expect } from 'chai';
import { format, fromUnixTime } from 'date-fns';
import {
  oneDayAgo,
  oneDayFromNow,
  oneWeekFromNow,
  oneYearFromNow,
} from '@@profile/tests/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import ApplicationsInProgress from '../../../components/benefit-application-drafts/ApplicationsInProgress';
import reducers from '~/applications/personalization/dashboard/reducers';

const savedForms = [
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
];

describe('ApplicationsInProgress component', () => {
  it('renders correctly when there are active saved forms', () => {
    const initialState = {
      user: {
        profile: {
          savedForms,
          loa: {
            current: 1,
            highest: 3,
          },
        },
      },
    };
    const view = renderInReduxProvider(<ApplicationsInProgress />, {
      initialState,
      reducers,
    });
    expect(view.getByText('Applications in progress', { exact: false })).to
      .exist;
    expect(
      view.getByText('Application for disability compensation', {
        exact: false,
      }),
    ).to.exist;
    expect(view.getByText('Application for dependent status', { exact: false }))
      .to.exist;
    expect(
      view.getByText('Application for health care benefits', { exact: false }),
    ).to.exist;

    const applicationsInProgress = view.getAllByTestId(
      'application-in-progress',
    );

    expect(applicationsInProgress.length).to.equal(3);
    expect(applicationsInProgress[0]).to.contain.text('FORM 21-526EZ');
    expect(applicationsInProgress[0]).to.contain.text(
      'Application expires on: ',
    );
    expect(applicationsInProgress[0]).to.contain.text(
      format(fromUnixTime(oneDayFromNow() / 1000), 'MMMM d, yyyy'),
    );
    expect(applicationsInProgress[0]).to.contain.text('Last saved on: ');
    expect(applicationsInProgress[0]).to.contain.text(
      format(fromUnixTime(oneDayAgo() / 1000), 'MMMM d, yyyy'),
    );

    expect(applicationsInProgress[1]).to.contain.text('FORM 686C-674');
    expect(applicationsInProgress[1]).to.contain.text(
      'Application expires on: ',
    );
    expect(applicationsInProgress[1]).to.contain.text(
      format(fromUnixTime(oneWeekFromNow() / 1000), 'MMMM d, yyyy'),
    );
    expect(applicationsInProgress[1]).to.contain.text('Last saved on: ');
    expect(applicationsInProgress[1]).to.contain.text(
      format(fromUnixTime(oneDayAgo() / 1000), 'MMMM d, yyyy'),
    );

    expect(applicationsInProgress[2]).to.contain.text('FORM 10-10EZ');
    expect(applicationsInProgress[2]).to.contain.text(
      'Application expires on: ',
    );
    expect(applicationsInProgress[2]).to.contain.text(
      format(fromUnixTime(oneYearFromNow() / 1000), 'MMMM d, yyyy'),
    );
    expect(applicationsInProgress[2]).to.contain.text('Last saved on: ');
    expect(applicationsInProgress[2]).to.contain.text(
      format(fromUnixTime(oneDayAgo() / 1000), 'MMMM d, yyyy'),
    );
  });

  it('renders correctly when there are no active saved forms', () => {
    const initialState = {
      user: {
        profile: {
          savedForms: [],
          loa: {
            current: 1,
            highest: 3,
          },
        },
      },
    };
    const view = renderInReduxProvider(<ApplicationsInProgress />, {
      initialState,
      reducers,
    });

    expect(
      view.getByText('You have no applications in progress.', { exact: false }),
    ).to.exist;
  });

  it('hides the header if hideH3 is true', () => {
    const initialState = {
      user: {
        profile: {
          savedForms: [],
          loa: {
            current: 1,
            highest: 3,
          },
        },
      },
    };
    const view = renderInReduxProvider(<ApplicationsInProgress hideH3 />, {
      initialState,
      reducers,
    });

    expect(view.queryByTestId('applications-in-progress-header')).to.not.exist;
  });

  it('renders the correct empty state text if the user is loa3', () => {
    const initialState = {
      user: {
        profile: {
          savedForms: [],
          loa: {
            current: 3,
            highest: 3,
          },
        },
      },
    };
    const view = renderInReduxProvider(<ApplicationsInProgress />, {
      initialState,
      reducers,
    });

    expect(view.getByTestId('applications-in-progress-header')).to.exist;
    expect(
      view.getByText('You have no applications in progress', {
        exact: false,
      }),
    ).to.exist;
  });
});
