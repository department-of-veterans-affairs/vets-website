import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import MockDate from 'mockdate';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';

import reducer from '../../redux/reducer';
import App from '../../containers/App';

describe('App', () => {
  let oldLocation;
  const getData = ({
    areFeatureTogglesLoading = false,
    hasFeatureFlag = true,
    hasClaimDetailsFeatureFlag = true,
    isLoggedIn = true,
    isLOA3 = true,
  } = {}) => {
    return {
      featureToggles: {
        loading: areFeatureTogglesLoading,
        /* eslint-disable camelcase */
        travel_pay_power_switch: hasFeatureFlag,
        travel_pay_view_claim_details: hasClaimDetailsFeatureFlag,
        /* eslint-enable camelcase */
      },
      user: {
        login: {
          currentlyLoggedIn: isLoggedIn,
        },
        profile: {
          services: [backendServices.USER_PROFILE],
          loa: {
            current: isLOA3 ? 3 : 1,
            highest: isLOA3 ? 3 : 1,
          },
          multifactor: true,
          verified: !!isLOA3,
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
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132fb',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'In Process',
          appointmentDateTime: '2024-04-22T21:22:34.465Z',
          appointmentName: 'more recent',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-04-22T21:22:34.465Z',
          modifiedOn: '2024-04-23T16:44:34.465Z',
        },
        {
          id: '6ea23179-e87c-44ae-a20a-f31fb2c132ig',
          claimNumber: 'TC0928098230498',
          claimName: 'string',
          claimStatus: 'Incomplete',
          appointmentDateTime: '2024-02-22T21:22:34.465Z',
          appointmentName: 'older',
          appointmentLocation: 'Cheyenne VA Medical Center',
          createdOn: '2024-02-22T21:22:34.465Z',
          modifiedOn: '2024-02-23T16:44:34.465Z',
        },
        {
          id: 'abcd1234-65af-4495-b18e-7fd28cab546a',
          claimNumber: 'TC0928098231234',
          claimName: 'string',
          claimStatus: 'Saved',
          appointmentDateTime: null,
          appointmentName: 'Medical imaging',
          appointmentLocation: 'Tomah VA Medical Center',
          createdOn: '2024-01-22T17:11:43.034Z',
          modifiedOn: '2024-01-22T17:11:43.034Z',
        },
        {
          id: '6cecf332-65af-4495-b18e-7fd28ccb546a',
          claimNumber: '39b7b38f-b7cf-4d19-91cf-fb5360c0b8b8',
          claimName: '3583ec0e-34e0-4cf5-99d6-78930c2be969',
          claimStatus: 'Saved',
          appointmentDateTime: '2023-09-22T17:11:43.034Z',
          appointmentName: 'Medical imaging',
          appointmentLocation: 'Tomah VA Medical Center',
          createdOn: '2023-09-22T17:11:43.034Z',
          modifiedOn: '2023-09-27T17:11:43.034Z',
        },
      ],
    };
    mockApiRequest(mockTravelClaims);
    MockDate.set('2024-06-25');
  });

  afterEach(() => {
    global.window.location = oldLocation;
    MockDate.reset();
  });

  it('should redirect if user not logged in', async () => {
    renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: false,
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  // TODO: find a better way to test this
  it('should render the MHV nav and Outlet if user is logged in', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    expect(await screen.findAllByText(/My HealtheVet/i)).to.exist;
  });

  it('should render a verify identity message if user is not LOA3', async () => {
    const screen = renderWithStoreAndRouter(<App />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        isLoggedIn: true,
        isLOA3: false,
      }),
      path: `/claims/`,
      reducers: reducer,
    });
    // TODO: update this once alert is in use
    expect(await screen.findByText(/verify your identity/i)).to.exist;
  });
});
