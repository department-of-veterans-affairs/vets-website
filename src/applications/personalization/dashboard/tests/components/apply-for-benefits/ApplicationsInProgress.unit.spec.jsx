import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { format, fromUnixTime, sub } from 'date-fns';
import {
  oneDayAgo,
  oneDayFromNow,
  oneWeekFromNow,
  oneYearFromNow,
} from '@@profile/tests/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';

import reducers from '~/applications/personalization/dashboard/reducers';
import ApplicationsInProgress from '../../../components/benefit-application-drafts/ApplicationsInProgress';

/**
 * TODO: move the savedForms and formsWithStatus to /fixtures
 */
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
  {
    // non-existent form
    form: '33333',
    metadata: {
      version: 1,
      returnUrl: '/example',
      savedAt: oneDayAgo(),
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        hasAttemptedSubmit: false,
      },
      expiresAt: oneYearFromNow() / 1000,
      lastUpdated: oneDayAgo() / 1000,
      inProgressFormId: 5179,
    },
    lastUpdated: oneDayAgo() / 1000,
  },
];

const formsWithStatus = [
  {
    id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
    type: 'submission_status',
    attributes: {
      id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
      detail: '',
      formType: '21-0845',
      message: null,
      status: 'received',
      createdAt: '2023-12-15T20:40:47.583Z',
      updatedAt: sub(Date.now(), { days: 1 }),
    },
  },
];

describe('ApplicationsInProgress component', () => {
  describe('when myVaFormSubmissionStatuses feature flag is turned off', () => {
    const state = {
      featureToggles: { [`my_va_form_submission_statuses`]: false },
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

    it('renders correctly when there are active saved forms', () => {
      const initialState = {
        ...state,
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
      expect(
        view.getByText('Application for dependent status', { exact: false }),
      ).to.exist;
      expect(
        view.getByText('Application for health care benefits', {
          exact: false,
        }),
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
        ...state,
        user: {
          profile: {
            savedForms: [],
          },
        },
      };
      const view = renderInReduxProvider(<ApplicationsInProgress />, {
        initialState,
        reducers,
      });

      expect(
        view.getByText('You have no applications in progress.', {
          exact: false,
        }),
      ).to.exist;
    });

    it('hides the header if hideH3 is true', () => {
      const initialState = {
        ...state,
        user: {
          profile: {
            savedForms: [],
          },
        },
      };
      const view = renderInReduxProvider(<ApplicationsInProgress hideH3 />, {
        initialState,
        reducers,
      });

      expect(view.queryByTestId('applications-in-progress-header')).to.not
        .exist;
    });

    it('renders the correct empty state text if the user is loa3', () => {
      const initialState = {
        ...state,
        user: {
          profile: {
            savedForms: [],
            loa: {
              current: 3,
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

  context('when myVaFormSubmissionStatuses feature flag is turned on', () => {
    const store = {
      getState: () => ({
        featureToggles: {
          [`my_va_form_submission_statuses`]: true,
        },
        user: {
          profile: {
            savedForms,
            loa: {
              current: 3,
              highest: 3,
            },
          },
        },
        allFormsWithStatuses: {
          forms: formsWithStatus,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    it('renders Draft forms', () => {
      const view = render(
        <Provider store={store}>
          <ApplicationsInProgress hideH3 savedForms />
        </Provider>,
      );

      expect(
        view.getByText('Application for disability compensation', {
          exact: false,
        }),
      ).to.exist;
      expect(
        view.getByText('Application for health care benefits', {
          exact: false,
        }),
      ).to.exist;

      const applicationsInProgress = view.getAllByTestId(
        'application-in-progress',
      );

      expect(applicationsInProgress.length).to.equal(3);

      expect(applicationsInProgress[0]).to.contain.text('Draft');
      expect(applicationsInProgress[0]).to.contain.text('VA FORM 21-526EZ');
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

      expect(applicationsInProgress[1]).to.contain.text('Draft');
      expect(applicationsInProgress[1]).to.contain.text('VA FORM 686C-674');
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

      expect(applicationsInProgress[2]).to.contain.text('Draft');
      expect(applicationsInProgress[2]).to.contain.text('VA FORM 10-10EZ');
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

    it('renders Received forms', () => {
      const view = render(
        <Provider store={store}>
          <ApplicationsInProgress
            hideH3
            formsWithStatus={formsWithStatus}
            savedForms
          />
        </Provider>,
      );

      const receivedApplications = view.getAllByTestId(
        'benefit-application-received',
      );
      expect(receivedApplications.length).to.equal(1);
      expect(receivedApplications[0]).to.contain.text('Received');
      expect(receivedApplications[0]).to.contain.text('VA FORM 21-0845');
      expect(receivedApplications[0]).to.contain.text('Submitted on: ');
      expect(receivedApplications[0]).to.contain.text('December 15, 2023');
      expect(receivedApplications[0]).to.contain.text('Received on: ');
      expect(receivedApplications[0]).to.contain.text(
        format(sub(Date.now(), { days: 1 }), 'MMMM d, yyyy'),
      );
    });
  });
});
