import React from 'react';

import { waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import { setupServer } from 'msw/node';

import { resetFetch } from 'platform/testing/unit/helpers';

import * as mocks from '../../../msw-mocks';
import { renderWithProfileReducers as render } from '../../unit-test-helpers';

import ProfileRouter from '../../../components/ProfileRouter';
import { PROFILE_PATH_NAMES } from '../../../constants';

const ALERT_ID = 'not-all-data-available-error';

// Returns the Redux state needed by the ProfileRouter and its child components
function createBasicInitialState() {
  return {
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {
        get() {},
      },
      dismissedDowntimeWarnings: [],
    },
    user: {
      login: {
        currentlyLoggedIn: true,
        hasCheckedKeepAlive: true,
      },
      profile: {
        status: 'OK',
        loa: {
          current: 3,
          highest: 3,
        },
        vet360: {},
        multifactor: true,
        services: ['evss-claims', 'user-profile', 'vet360'],
        veteranStatus: {
          status: 'OK',
          isVeteran: true,
          servedInMilitary: true,
        },
        verified: true,
      },
    },
  };
}

/**
 * Checks that the error alert appears on the main Profile page as well as all
 * of the provided pages.
 *
 * @param {string[]} pageNames - Array of button labels that exist in the
 * Profile sub-nav
 */
async function errorAppearsOnAllPages(
  pageNames = [
    PROFILE_PATH_NAMES.MILITARY_INFORMATION,
    PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
    PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
    PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS,
  ],
) {
  const initialState = createBasicInitialState();
  const view = render(<ProfileRouter isLOA3 isInMVI />, {
    initialState,
  });
  const spinner = view.queryByRole('progressbar');
  await waitForElementToBeRemoved(spinner);

  let alert = await view.findByTestId(ALERT_ID);
  expect(alert).to.exist;
  expect(alert).to.contain.html('We can’t load all of your information');
  expect(alert).to.contain.html(
    'We’re sorry. Something went wrong on our end. We can’t display all the information on this page. Please refresh the page or try again later.',
  );

  pageNames.forEach(pageName => {
    userEvent.click(view.getByRole('link', { name: pageName }));
    alert = view.getByTestId(ALERT_ID);
    expect(alert).to.exist;
  });
}

async function hideErrorNonVet(
  pageNames = [
    PROFILE_PATH_NAMES.MILITARY_INFORMATION,
    PROFILE_PATH_NAMES.DIRECT_DEPOSIT,
    PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
    PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS,
  ],
) {
  const initialState = createBasicInitialState();
  initialState.user.profile.veteranStatus = null;

  const view = render(<ProfileRouter isLOA3 isInMVI />, {
    initialState,
  });
  const spinner = view.queryByRole('progressbar');
  await waitForElementToBeRemoved(spinner);

  const alert = view.queryByTestId(ALERT_ID);
  expect(alert).not.to.exist;

  pageNames.forEach(pageName => {
    userEvent.click(view.getByRole('link', { name: pageName }));
    expect(view.queryByTestId(ALERT_ID)).to.not.exist;
  });
}

describe('Profile "Not all data available" error', () => {
  let server;

  before(() => {
    resetFetch();
    server = setupServer(...mocks.allProfileEndpointsLoaded);
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
  });
  after(() => {
    server.close();
  });
  it('should not be shown if we can get data from all required endpoints', async () => {
    const initialState = createBasicInitialState();
    const view = render(<ProfileRouter isLOA3 isInMVI />, {
      initialState,
    });
    const spinner = view.queryByRole('progressbar');
    await waitForElementToBeRemoved(spinner);
    expect(view.queryByTestId(ALERT_ID)).not.to.exist;
  });

  it('should not be shown if there is a 500 error with the `GET service_history` endpoint and the user is not a vet', async () => {
    server.use(...mocks.getServiceHistory500);

    await hideErrorNonVet();
  });

  it('should not be shown if there is a 401 error with the `GET service_history` endpoint and the user is not a vet', async () => {
    server.use(...mocks.getServiceHistory401);

    await hideErrorNonVet();
  });

  it('should be shown on all pages if there is an error with the `GET full_name` endpoint', async () => {
    server.use(...mocks.getFullNameFailure);

    await errorAppearsOnAllPages();
  });

  it('should be shown on all pages if there is an error with the `GET personal_information` endpoint', async () => {
    server.use(...mocks.getPersonalInformationFailure);

    await errorAppearsOnAllPages();
  });

  it('should be shown on all pages if there is a 500 error with the `GET service_history` endpoint', async () => {
    server.use(...mocks.getServiceHistory500);

    await errorAppearsOnAllPages();
  });

  it('should be shown on all pages if there is a 401 error with the `GET service_history` endpoint', async () => {
    server.use(...mocks.getServiceHistory401);

    await errorAppearsOnAllPages();
  });

  it('should be shown on all pages if there is an error with the `GET payment_information` endpoint`', async () => {
    server.use(...mocks.getPaymentInformationFailure);

    // don't check for the error on the direct deposit page since that page is unavailable when the `GET payment_information` endpoint fails
    await errorAppearsOnAllPages([
      PROFILE_PATH_NAMES.MILITARY_INFORMATION,
      PROFILE_PATH_NAMES.ACCOUNT_SECURITY,
      PROFILE_PATH_NAMES.CONNECTED_APPLICATIONS,
    ]);
  });
});
