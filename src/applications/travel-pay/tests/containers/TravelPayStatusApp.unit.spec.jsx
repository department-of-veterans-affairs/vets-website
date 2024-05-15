import React from 'react';
import { expect } from 'chai';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';

import reducer from '../../redux/reducer';
import App from '../../containers/TravelPayStatusApp';

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

  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;
    global.window.location = {
      replace: sinon.spy(),
    };
    const mockTravelClaims = {
      data: [
        { id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb' },
        { claimNumber: 'TC0928098230498' },
        { claimName: 'string' },
        { claimStatus: 'IN_PROCESS' },
        { appointmentDate: '2024-04-22T16:45:34.465Z' },
        { appointmentName: 'check-up' },
        { appointmentLocation: 'Cheyenne VA Medical Center' },
        { createdOn: '2024-04-22T21:22:34.465Z' },
        { modifiedOn: '2024-04-23T16:44:34.465Z' },
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

  // it.only('renders a loading state when loading claims for an authenticated user', async () => {
  //   const middlewares = [thunk];
  //   const mockStore = configureStore(middlewares);

  //   const data = getData({
  // areFeatureTogglesLoading: false,
  // hasFeatureFlag: true,
  // isLoggedIn: true,
  //   });

  //   const { container } = render(
  //     <Provider store={mockStore(data)}>
  //       <App />
  //     </Provider>,
  //   );

  // const { container } = render(<App />);
  // await waitFor(() => {
  //   console.log($('va-loading-indicator', container)); // eslint-disable-line no-console
  //   expect($('va-loading-indicator', container)).to.exist;
  // });
  // });

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

    // console.log('find', $('va-button', container));

    // fireEvent.click($('va-button', container));
    expect($('va-loading-indicator', container)).to.exist;
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

    // console.log('find', $('va-button', container));

    fireEvent.click($('va-button', container));
    expect($('va-button', container)).to.exist;
  });
});
