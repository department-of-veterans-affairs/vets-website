import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { format, fromUnixTime } from 'date-fns';
import {
  oneDayAgo,
  oneDayFromNow,
  oneWeekFromNow,
  oneYearFromNow,
} from '@@profile/tests/helpers';

import ApplicationsInProgress from '../../../components/benefit-application-drafts/ApplicationsInProgress';

/**
 * TODO: move the savedForms and formsWithStatus to /fixtures
 */
const dayAgo = oneDayAgo();
const dayFromNow = oneDayFromNow();
const weekFromNow = oneWeekFromNow();
const yearFromNow = oneYearFromNow();

const savedForms = [
  {
    form: '686C-674-V2',
    metadata: {
      version: 1,
      returnUrl: '/net-worth',
      savedAt: dayAgo,
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false,
      },
      expiresAt: weekFromNow / 1000,
      lastUpdated: dayAgo / 1000,
      inProgressFormId: 5179,
    },
    lastUpdated: dayAgo / 1000,
  },
  {
    form: '21-526EZ',
    metadata: {
      version: 1,
      returnUrl: '/net-worth',
      savedAt: dayAgo,
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false,
      },
      expiresAt: dayFromNow / 1000,
      lastUpdated: dayAgo / 1000,
      inProgressFormId: 5179,
    },
    lastUpdated: dayAgo / 1000,
  },
  {
    form: '1010ez',
    metadata: {
      version: 1,
      returnUrl: '/net-worth',
      savedAt: dayAgo,
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        timestamp: false,
        hasAttemptedSubmit: false,
      },
      expiresAt: yearFromNow / 1000,
      lastUpdated: dayAgo / 1000,
      inProgressFormId: 5179,
    },
    lastUpdated: dayAgo / 1000,
  },
  {
    // non-existent form
    form: '33333',
    metadata: {
      version: 1,
      returnUrl: '/example',
      savedAt: dayAgo,
      submission: {
        status: false,
        errorMessage: false,
        id: false,
        hasAttemptedSubmit: false,
      },
      expiresAt: yearFromNow / 1000,
      lastUpdated: dayAgo / 1000,
      inProgressFormId: 5179,
    },
    lastUpdated: dayAgo / 1000,
  },
];

const STATUS_CREATED_AT = '2023-12-15T20:40:47.583Z';
const STATUS_UPDATED_AT = '2023-12-15T22:40:47.583Z';
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
      createdAt: STATUS_CREATED_AT,
      updatedAt: STATUS_UPDATED_AT,
      pdfSupport: true,
    },
  },
  {
    id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
    type: 'submission_status',
    attributes: {
      id: '3b03b5a0-3ad9-4207-b61e-3a13ed1c8b80',
      detail: '',
      formType: '22-1990',
      message: null,
      status: 'vbms',
      createdAt: STATUS_CREATED_AT,
      updatedAt: STATUS_UPDATED_AT,
      pdfSupport: false,
    },
  },
];

describe('ApplicationsInProgress component', () => {
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
      submittedForms: {
        forms: formsWithStatus,
      },
      myVaFormPdfs: {
        loading: false,
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
      view.getByText(
        'Application for adding or removing dependents on VA benefits',
        {
          exact: false,
        },
      ),
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
    expect(applicationsInProgress[0]).to.contain.text('VA Form 21-526EZ');
    expect(applicationsInProgress[0]).to.contain.text(
      'Application expires on: ',
    );
    expect(applicationsInProgress[0]).to.contain.text(
      format(fromUnixTime(dayFromNow / 1000), 'MMMM d, yyyy'),
    );
    expect(applicationsInProgress[0]).to.contain.text('Last saved on: ');
    expect(applicationsInProgress[0]).to.contain.text(
      format(fromUnixTime(dayAgo / 1000), 'MMMM d, yyyy'),
    );

    expect(applicationsInProgress[1]).to.contain.text('Draft');
    expect(applicationsInProgress[1]).to.contain.text('VA Form 686C-674');
    expect(applicationsInProgress[1]).to.contain.text(
      'Application expires on: ',
    );
    expect(applicationsInProgress[1]).to.contain.text(
      format(fromUnixTime(weekFromNow / 1000), 'MMMM d, yyyy'),
    );
    expect(applicationsInProgress[1]).to.contain.text('Last saved on: ');
    expect(applicationsInProgress[1]).to.contain.text(
      format(fromUnixTime(dayAgo / 1000), 'MMMM d, yyyy'),
    );

    expect(applicationsInProgress[2]).to.contain.text('Draft');
    expect(applicationsInProgress[2]).to.contain.text('VA Form 10-10EZ');
    expect(applicationsInProgress[2]).to.contain.text(
      'Application expires on: ',
    );
    expect(applicationsInProgress[2]).to.contain.text(
      format(fromUnixTime(yearFromNow / 1000), 'MMMM d, yyyy'),
    );
    expect(applicationsInProgress[2]).to.contain.text('Last saved on: ');
    expect(applicationsInProgress[2]).to.contain.text(
      format(fromUnixTime(dayAgo / 1000), 'MMMM d, yyyy'),
    );
  });

  it('renders Submission Status forms', () => {
    const view = render(
      <Provider store={store}>
        <ApplicationsInProgress
          hideH3
          submittedForms={formsWithStatus}
          savedForms
        />
      </Provider>,
    );

    const receivedApplications = view.getAllByTestId('submitted-application');
    expect(receivedApplications.length).to.equal(2);
    expect(receivedApplications[0]).to.contain.text('Submission in Progress');
    expect(receivedApplications[0]).to.contain.text('VA Form 21-0845');
    expect(receivedApplications[0]).to.contain.text('Submitted on: ');
    expect(receivedApplications[0]).to.contain.text('December 15, 2023');

    expect(receivedApplications[1]).to.contain.text('Received');
    expect(receivedApplications[1]).to.contain.text('VA Form 22-1990');
    expect(receivedApplications[1]).to.contain.text('Submitted on: ');
    expect(receivedApplications[1]).to.contain.text('December 15, 2023');
    expect(receivedApplications[1]).to.contain.text('Received on: ');
    expect(receivedApplications[1]).to.contain.text(
      format(new Date(STATUS_UPDATED_AT), 'MMMM d, yyyy'),
    );
  });

  it('renders accordion help message', () => {
    const view = render(
      <Provider store={store}>
        <ApplicationsInProgress hideH3 savedForms />
      </Provider>,
    );
    expect(view.getByTestId('missing-application-help')).to.exist;
  });

  describe('Custom form labels', () => {
    it('renders custom label for 22-10297 (VET TEC 2.0)', () => {
      const customSavedForms = [
        {
          form: '22-10275',
          metadata: {
            version: 1,
            returnUrl: '/10275',
            savedAt: dayAgo,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: false,
              hasAttemptedSubmit: false,
            },
            expiresAt: weekFromNow / 1000,
            lastUpdated: dayAgo / 1000,
            inProgressFormId: 5179,
          },
          lastUpdated: dayAgo / 1000,
        },
        {
          form: '22-10297',
          metadata: {
            version: 1,
            returnUrl: '/example',
            savedAt: dayAgo,
            submission: {
              status: false,
              errorMessage: false,
              id: false,
              timestamp: false,
              hasAttemptedSubmit: false,
            },
            expiresAt: weekFromNow / 1000,
            lastUpdated: dayAgo / 1000,
            inProgressFormId: 5179,
          },
          lastUpdated: dayAgo / 1000,
        },
      ];

      const customStore = {
        ...store,
        getState: () => ({
          ...store.getState(),
          user: {
            profile: {
              savedForms: customSavedForms,
              loa: {
                current: 3,
                highest: 3,
              },
            },
          },
        }),
      };

      const view = render(
        <Provider store={customStore}>
          <ApplicationsInProgress hideH3 savedForms />
        </Provider>,
      );

      expect(
        view.getByText(
          '22-10275 (Commit to the Principles of Excellence for educational institutions)',
          {
            exact: false,
          },
        ),
      ).to.exist;
      expect(
        view.getByText('22-10297 (Apply for VET TEC 2.0 (high-tech program))', {
          exact: false,
        }),
      ).to.exist;
    });
  });
});
