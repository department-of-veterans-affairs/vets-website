import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import TravelClaimDetails from '../../components/TravelClaimDetails';
import reducer from '../../redux/reducer';

describe('TravelClaimDetails', () => {
  const claimDetailsProps = {
    id: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
    claimNumber: 'TC0928098230498',
    claimStatus: 'Claim submitted',
    appointmentDateTime: '2024-05-26T16:40:45.781Z',
    facilityName: 'Tomah VA Medical Center',
    createdOn: '2024-05-27T16:40:45.781Z',
    modifiedOn: '2024-05-31T16:40:45.781Z',
  };
  const getState = ({
    featureTogglesAreLoading = false,
    hasStatusFeatureFlag = true,
    hasDetailsFeatureFlag = true,
    loadingDetails = false,
    detailsError = null,
    detailsData = {},
  } = {}) => ({
    featureToggles: {
      loading: featureTogglesAreLoading,
      /* eslint-disable camelcase */
      travel_pay_power_switch: hasStatusFeatureFlag,
      travel_pay_view_claim_details: hasDetailsFeatureFlag,
      /* eslint-enable camelcase */
    },
    travelPay: {
      claimDetails: {
        isLoading: loadingDetails,
        error: detailsError,
        data: detailsData,
      },
    },
  });

  let oldLocation;
  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;

    global.window.location = {
      replace: sinon.spy(),
    };
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('Successfully renders', async () => {
    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: {
        ...getState({ detailsData: { '1234': { ...claimDetailsProps } } }),
      },
      path: '/claims/1234',
      reducers: reducer,
    });

    await waitFor(() => {
      expect(
        screen.getByText(
          /If you're eligible for reimbursement, we'll deposit your reimbursement in your bank account./i,
        ),
      );
    });
  });

  it('redirects to the root path when claim statuses feature flag is false', async () => {
    renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: { ...getState({ hasStatusFeatureFlag: false }) },
      path: '/claims/1234',
      reducers: reducer,
    });

    await waitFor(() => {
      expect(window.location.replace.calledWith('/')).to.be.true;
    });
  });

  it('redirects to claim details when claim details feature flag is false', async () => {
    renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: { ...getState({ hasDetailsFeatureFlag: false }) },
      path: '/claims/1234',
      reducers: reducer,
    });

    await waitFor(() => {
      expect(window.location.replace.calledWith('/my-health/travel-pay')).to.be
        .true;
    });
  });

  it('handles failed data fetching and displays an error', async () => {
    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: {
        ...getState({
          detailsError: { errors: [{ title: 'Bad Request', status: 400 }] },
        }),
      },
      path: '/claims/1234',
      reducers: reducer,
    });

    await waitFor(() => {
      expect(screen.getByText(/There was an error loading the claim details/i))
        .to.exist;
    });
  });
});
