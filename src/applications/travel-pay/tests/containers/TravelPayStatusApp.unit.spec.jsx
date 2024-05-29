import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import backendServices from '@department-of-veterans-affairs/platform-user/profile/backendServices';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import reducer from '../../redux/reducer';

import App from '../../containers/TravelPayStatusApp';

describe('App', () => {
  let oldLocation;
  const initialStateFeatureFlag = (loading = true, flag = true) => {
    return {
      initialState: {
        featureToggles: {
          loading,
          // eslint-disable-next-line camelcase
          travel_pay_power_switch: flag,
        },
        user: {
          login: {
            currentlyLoggedIn: true,
          },
          profile: {
            services: [backendServices.USER_PROFILE],
          },
        },
      },
      path: `/`,
      reducers: reducer,
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
    renderWithStoreAndRouter(<App />, initialStateFeatureFlag(false, false));
    await waitFor(() => {
      expect(window.location.replace.called).to.be.true;
    });
  });

  it('should render loading state if feature flag is loading', () => {
    const screenFeatureToggle = renderWithStoreAndRouter(
      <App />,
      initialStateFeatureFlag(),
    );
    expect(screenFeatureToggle.getByTestId('travel-pay-loading-indicator'));
  });
});
