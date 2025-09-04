import React from 'react';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { mockFetch } from '@department-of-veterans-affairs/platform-testing/helpers';
import { renderInReduxProvider } from '~/platform/testing/unit/react-testing-library-helpers';
import { Toggler } from '~/platform/utilities/feature-toggles';
import reducers from '~/applications/personalization/dashboard/reducers';
import Dashboard from '../../components/Dashboard';

describe('<Dashboard />', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      vaProfile: {
        hero: {
          userFullName: {
            first: 'Hector',
            middle: 'J',
            last: 'Allen',
            suffix: null,
          },
          errors: null,
        },
      },
      allPayments: {
        isLoading: false,
        payments: [],
        error: null,
      },
      allDebts: {
        isLoading: false,
        isError: false,
        copays: [],
        copaysErrors: [],
        debts: [],
        debtsErrors: [],
      },
      user: {
        login: {
          currentlyLoggedIn: true,
          hasCheckedKeepAlive: false,
        },
        profile: {
          loa: {
            current: 3,
            highest: 3,
          },
          loading: false,
          services: ['appeals-status'],
          claims: {},
          signIn: { serviceName: 'logingov' },
          vapContactInfo: {
            email: {
              createdAt: '2018-04-20T17:24:13.000Z',
              emailAddress: 'myemail72585885@unattended.com',
              effectiveEndDate: null,
              effectiveStartDate: '2019-03-07T22:32:40.000Z',
              id: 20648,
              sourceDate: '2019-03-07T22:32:40.000Z',
              sourceSystemUser: null,
              transactionId: '44a0858b-3dd1-4de2-903d-38b147981a9c',
              updatedAt: '2019-03-08T05:09:58.000Z',
              vet360Id: '1273766',
            },
            mailingAddress: {
              addressLine1: '123 Mailing Address St.',
              addressLine2: 'Apt 1',
              addressLine3: null,
              addressPou: 'CORRESPONDENCE',
              addressType: 'DOMESTIC',
              city: 'Fulton',
              countryName: 'United States',
              countryCodeIso2: 'US',
              countryCodeIso3: 'USA',
              countryCodeFips: null,
              countyCode: null,
              countyName: null,
              createdAt: '2022-03-21T21:06:15.000Z',
              effectiveEndDate: null,
              effectiveStartDate: '2022-03-23T19:14:59.000Z',
              geocodeDate: '2022-03-23T19:15:00.000Z',
              geocodePrecision: null,
              id: 311999,
              internationalPostalCode: null,
              latitude: 45.2248,
              longitude: -121.3595,
              province: null,
              sourceDate: '2022-03-23T19:14:59.000Z',
              sourceSystemUser: null,
              stateCode: 'NY',
              transactionId: '3ea3ecf8-3ddf-46d9-8a4b-b5554385b3fb',
              updatedAt: '2022-03-23T19:15:01.000Z',
              validationKey: null,
              vet360Id: '1273766',
              zipCode: '97063',
              zipCodeSuffix: null,
              badAddress: null,
            },
            mobilePhone: {
              areaCode: '619',
              countryCode: '1',
              createdAt: '2022-01-12T16:22:03.000Z',
              extension: null,
              effectiveEndDate: null,
              effectiveStartDate: '2022-02-17T20:15:44.000Z',
              id: 269804,
              isInternational: false,
              isTextable: null,
              isTextPermitted: null,
              isTty: null,
              isVoicemailable: null,
              phoneNumber: '5551234',
              phoneType: 'MOBILE',
              sourceDate: '2022-02-17T20:15:44.000Z',
              sourceSystemUser: null,
              transactionId: 'fdb13953-f670-4bd3-a3bb-8881eb9165dd',
              updatedAt: '2022-02-17T20:15:45.000Z',
              vet360Id: '1273766',
            },
          },
        },
      },
      featureToggles: {
        [Toggler.TOGGLE_NAMES.authExpVbaDowntimeMessage]: false,
      },
    };
  });

  it('renders the verify your identity component for an LOA1 user', async () => {
    mockFetch();
    initialState.user.profile.loa.current = 1;
    initialState.user.profile.loa.highest = 1;

    const { getByTestId, container } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    await waitFor(() => {
      expect(getByTestId('dashboard-title')).to.exist;
      expect(container.querySelector('va-alert-sign-in')).to.exist;
    });
  });

  it('renders the welcome modal for a recent LOA1 user', async () => {
    mockFetch();
    initialState.user.profile.loa.current = 1;
    initialState.user.profile.loa.highest = 1;
    initialState.featureToggles = {
      [Toggler.TOGGLE_NAMES
        .veteranOnboardingShowWelcomeMessageToNewUsers]: true,
    };

    // User created 8 hours ago is recent
    initialState.user.profile.initialSignIn = new Date(
      new Date().getTime() - 8 * 60 * 60 * 1000,
    );

    const { getByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    await waitFor(() => {
      expect(getByTestId('welcome-modal')).to.exist;
    });
  });

  it('does not render the welcome modal for LOA1 user that is not recent', async () => {
    mockFetch();
    initialState.user.profile.loa.current = 1;
    initialState.user.profile.loa.highest = 1;
    initialState.featureToggles = {
      [Toggler.TOGGLE_NAMES
        .veteranOnboardingShowWelcomeMessageToNewUsers]: true,
    };

    // User created 36 hours ago is not recent
    initialState.user.profile.initialSignIn = new Date(
      new Date().getTime() - 36 * 60 * 60 * 1000,
    );

    const { queryByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    expect(queryByTestId('welcome-modal')).to.not.exist;
  });

  it('does not render the ContactInfoNeeded alert for an LOA1 user', async () => {
    mockFetch();
    initialState.user.profile.loa.current = 1;
    initialState.user.profile.loa.highest = 1;

    const { queryByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    await waitFor(() => {
      expect(queryByTestId('account-blocked-alert')).to.not.exist;
    });
  });

  it('does not render the ContactInfoNeeded alert for an LOA1 user missing at least one required piece of contact information', async () => {
    mockFetch();
    initialState.user.profile.loa.current = 1;
    initialState.user.profile.loa.highest = 1;
    initialState.user.profile.vapContactInfo.email = null;

    const { queryByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    await waitFor(() => {
      expect(queryByTestId('account-blocked-alert')).to.not.exist;
    });
  });

  it('renders for an LOA3 user', async () => {
    mockFetch();

    const { getByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    await waitFor(() => {
      expect(getByTestId('dashboard-title')).to.exist;
      expect(getByTestId('dashboard-section-claims-and-appeals')).to.exist;
      expect(getByTestId('dashboard-section-health-care')).to.exist;
      expect(getByTestId('dashboard-section-debts')).to.exist;
      expect(getByTestId('dashboard-section-payment')).to.exist;
      expect(getByTestId('dashboard-section-benefit-application-drafts')).to
        .exist;
      expect(getByTestId('dashboard-section-education-and-training')).to.exist;
    });
  });

  it('does not render a ContactInfoNeeded alert for an LOA3 user with all three required pieces of contact information', async () => {
    mockFetch();

    const { queryByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    await waitFor(() => {
      expect(queryByTestId('account-blocked-alert')).to.not.exist;
    });
  });

  it('renders a ContactInfoNeeded alert for an LOA3 user missing at least one required piece of contact information', async () => {
    mockFetch();
    initialState.user.profile.vapContactInfo.email = null;

    const { getByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    await waitFor(() => {
      expect(getByTestId('account-blocked-alert')).to.exist;
    });
  });

  it('renders MPI Connection Error', async () => {
    mockFetch();
    initialState.user.profile.status = 'SERVER_ERROR';

    const { getByTestId, queryByTestId } = renderInReduxProvider(
      <Dashboard />,
      {
        initialState,
        reducers,
      },
    );

    await waitFor(() => {
      expect(getByTestId('mpi-connection-error')).to.exist;
      expect(queryByTestId('dashboard-section-claims-and-appeals')).to.not
        .exist;
      expect(getByTestId('dashboard-section-health-care')).to.exist;
      expect(getByTestId('dashboard-section-debts')).to.exist;
      expect(getByTestId('dashboard-section-payment')).to.exist;
      expect(getByTestId('dashboard-section-benefit-application-drafts')).to
        .exist;
      expect(getByTestId('dashboard-section-education-and-training')).to.exist;
    });
  });

  it('renders the Not In MPI Error', async () => {
    mockFetch();
    initialState.user.profile.status = 'NOT_FOUND';

    const { getByTestId, queryByTestId } = renderInReduxProvider(
      <Dashboard />,
      {
        initialState,
        reducers,
      },
    );

    await waitFor(() => {
      expect(getByTestId('not-in-mpi')).to.exist;
      expect(queryByTestId('dashboard-section-claims-and-appeals')).to.not
        .exist;
      expect(getByTestId('dashboard-section-health-care')).to.exist;
      expect(getByTestId('dashboard-section-debts')).to.exist;
      expect(getByTestId('dashboard-section-payment')).to.exist;
      expect(getByTestId('dashboard-section-benefit-application-drafts')).to
        .exist;
      expect(getByTestId('dashboard-section-education-and-training')).to.exist;
    });
  });

  it("shows the loader if feature toggles aren't loaded", async () => {
    mockFetch();
    initialState.featureToggles = { loading: true };

    const { getByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });

    await waitFor(() => {
      expect(getByTestId('req-loader')).to.exist;
    });
  });

  it('renders a link to confirm contact email', async () => {
    mockFetch();
    const { getByTestId } = renderInReduxProvider(<Dashboard />, {
      initialState,
      reducers,
    });
    const testId = 'va-profile--confirm-contact-email-link';
    const href = '/profile/contact-information#contact-email-address';
    const textContent = /Confirm your contact email address/;
    await waitFor(() => {
      const confirmEmailLink = getByTestId(testId);
      expect(confirmEmailLink).to.exist;
      expect(confirmEmailLink.link).to.satisfy(str => str.endsWith(href));
      expect(confirmEmailLink.text).to.match(textContent);
    });
  });
});
