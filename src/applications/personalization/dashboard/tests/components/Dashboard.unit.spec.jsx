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
});
