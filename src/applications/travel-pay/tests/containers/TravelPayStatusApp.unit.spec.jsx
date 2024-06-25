import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

import reducer from '../../redux/reducer';
import App from '../../containers/TravelPayStatusApp';
import { formatDateTime } from '../../util/dates';
import travelClaims from '../../services/mocks/travel-claims-31.json';

describe('App', () => {
  let oldLocation;
  const getData = ({
    areFeatureTogglesLoading = true,
    hasFeatureFlag = true,
    isLoggedIn = true,
  } = {}) => {
    return {
      featureToggles: {
        loading: areFeatureTogglesLoading,
        // eslint-disable-next-line camelcase
        travel_pay_power_switch: hasFeatureFlag,
      },
      user: {
        login: {
          currentlyLoggedIn: isLoggedIn,
        },
        profile: {
          services: [backendServices.USER_PROFILE],
        },
      },
    };
  };

  const aprDate = '2024-04-22T16:45:34.465Z';
  const febDate = '2024-02-22T16:45:34.465Z';

  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };
    const mockTravelClaims = {
      data: [
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'IN_PROCESS',
          appointmentDateTime: aprDate,
          appointmentName: 'more recent',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-04-22T21:22:34.465Z',
          modifiedOn: '2024-04-23T16:44:34.465Z',
        },
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132ig',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'INCOMPLETE',
          appointmentDateTime: febDate,
          appointmentName: 'older',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-02-22T21:22:34.465Z',
          modifiedOn: '2024-02-23T16:44:34.465Z',
        },
      ],
    };
    mockApiRequest(mockTravelClaims);
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('should redirect if feature flag is off', async () => {
    renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: false,
      }),
      path: `/`,
      reducers: reducer,
    });
    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  it('should render loading state if feature flag is loading', async () => {
    const screenFeatureToggle = renderWithStoreAndRouter(<App />, {
      initialState: getData(),
      path: `/`,
      reducers: reducer,
    });
    expect(
      await screenFeatureToggle.getByTestId('travel-pay-loading-indicator'),
    ).to.exist;
  });

  it('renders a login prompt for an unauthenticated user', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: false,
      }),
      path: `/`,
      reducers: reducer,
    });
    expect(await screen.findByText('Log in to view your travel claims')).to
      .exist;
  });

  it('shows the login modal when clicking the login prompt', async () => {
    const { container } = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    expect($('va-loading-indicator', container)).to.exist;
  });

  it('handles a failed fetch of claims', async () => {
    global.fetch.restore();
    mockApiRequest({ error: 'oh no' }, false);

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      expect(await screen.findByText('Error fetching travel claims.')).to.exist;
    });
  });

  it('handles a successful fetch of zero claims', async () => {
    global.fetch.restore();
    mockApiRequest({ data: [] });

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      expect(screen.queryAllByTestId('travel-claim-details').length).to.eq(0);
      expect(await screen.findByText('No travel claims to show.')).to.exist;
    });
  });

  it('shows the login modal when clicking the login prompt', async () => {
    const { container } = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: false,
      }),
      path: `/`,
      reducers: reducer,
    });

    fireEvent.click($('va-button', container));
    // TODO: make this check for the modal itself
    expect($('va-button', container)).to.exist;
  });

  it('sorts the claims correctly using the select-option', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(() => {
      const [date, time] = formatDateTime(febDate);
      userEvent.selectOptions(screen.getByRole('combobox'), ['oldest']);
      expect(screen.getByRole('option', { name: 'Oldest' }).selected).to.be
        .true;
      fireEvent.click(document.querySelector('va-button[text="Sort"]'));

      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(2);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
    });

    await waitFor(() => {
      const [date, time] = formatDateTime(aprDate);
      userEvent.selectOptions(screen.getByRole('combobox'), ['mostRecent']);
      expect(screen.getByRole('option', { name: 'Most Recent' }).selected).to.be
        .true;
      fireEvent.click(document.querySelector('va-button[text="Sort"]'));

      expect(screen.getAllByTestId('travel-claim-details').length).to.eq(2);
      expect(
        screen.getAllByTestId('travel-claim-details')[0].textContent,
      ).to.eq(`${date} at ${time} appointment`);
    });
  });

  it('displayed status filters correctly', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(() => {
      const statusFilters = screen.getAllByTestId('status-filter');
      expect(statusFilters.length).to.eq(2);
      expect(statusFilters.map(filter => filter.label)).to.include(
        'INCOMPLETE',
      );
      expect(statusFilters.map(filter => filter.label)).to.include(
        'IN_PROCESS',
      );
    });
  });

  it('renders pagination correctly', async () => {
    global.fetch.restore();
    mockApiRequest(travelClaims);

    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/`,
      reducers: reducer,
    });

    await waitFor(async () => {
      expect(await screen.findByText('Showing 1 ‒ 10 of 31 events')).to.exist;
      // RTL doesn't support shadow DOM elements, so best we can do here is
      // check that the top-level pagination element gets rendered
      expect(await screen.container.querySelectorAll('va-card').length).to.eq(
        10,
      );
      expect(await screen.container.querySelector('va-pagination')).to.exist;
    });
  });
});
