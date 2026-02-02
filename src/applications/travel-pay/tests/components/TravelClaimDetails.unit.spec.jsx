import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { subDays, addDays, format } from 'date-fns';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { createServiceMap } from '@department-of-veterans-affairs/platform-monitoring';
import TravelClaimDetails from '../../components/TravelClaimDetails';
import reducer from '../../redux/reducer';

describe('TravelClaimDetails', () => {
  const claimDetailsProps = {
    claimId: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
    claimNumber: 'TC0928098230498',
    claimStatus: 'Claim submitted',
    appointmentDate: '2024-05-26T16:40:45.781Z',
    facilityName: 'Tomah VA Medical Center',
    createdOn: '2024-05-27T16:40:45.781Z',
    modifiedOn: '2024-05-31T16:40:45.781Z',
  };

  const getState = ({
    featureTogglesAreLoading = false,
    hasStatusFeatureFlag = true,
    hasDetailsFeatureFlag = true,
    hasClaimsManagementFlag = true,
    loadingDetails = false,
    detailsError = null,
    detailsData = {},
    appointmentLoading = false,
    appointmentData = null,
  } = {}) => ({
    featureToggles: {
      loading: featureTogglesAreLoading,
      /* eslint-disable camelcase */
      travel_pay_power_switch: hasStatusFeatureFlag,
      travel_pay_view_claim_details: hasDetailsFeatureFlag,
      travel_pay_claims_management: hasClaimsManagementFlag,
      /* eslint-enable camelcase */
    },
    travelPay: {
      claimDetails: {
        isLoading: loadingDetails,
        error: detailsError,
        data: detailsData,
      },
      appointment: {
        isLoading: appointmentLoading,
        data: appointmentData,
      },
    },
    scheduledDowntime: {
      globalDowntime: null,
      isReady: true,
      isPending: false,
      serviceMap: {},
      dismissedDowntimeWarnings: [],
    },
  });

  let oldLocation;
  beforeEach(() => {
    oldLocation = global.window.location;
    global.window.location = {};
    global.window.location.replace = sinon.spy();
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('Successfully renders', () => {
    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: {
        ...getState({ detailsData: { '1234': { ...claimDetailsProps } } }),
      },
      path: '/claims/1234',
      reducers: reducer,
    });

    expect(screen.getByText(/set up another direct deposit for VA travel pay/i))
      .to.exist;
    expect(screen.getByText(/deposit your funds in your bank account/i)).to
      .exist;
  });

  it('redirects to the root path when claim statuses feature flag is false', () => {
    renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: { ...getState({ hasStatusFeatureFlag: false }) },
      path: '/claims/1234',
      reducers: reducer,
    });

    expect(window.location.replace.calledWith('/')).to.be.true;
  });

  it('redirects to claim details when claim details feature flag is false', () => {
    renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: { ...getState({ hasDetailsFeatureFlag: false }) },
      path: '/claims/1234',
      reducers: reducer,
    });

    expect(window.location.replace.calledWith('/my-health/travel-pay')).to.be
      .true;
  });

  it('shows a spinner while claim details are loading', () => {
    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: {
        ...getState({
          loadingDetails: true,
        }),
      },
      path: '/claims/1234',
      reducers: reducer,
    });

    expect(screen.getByTestId('travel-pay-loading-indicator')).to.exist;
  });

  it('handles failed data fetching and displays an error', () => {
    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: {
        ...getState({
          detailsError: { errors: [{ title: 'Bad Request', status: 400 }] },
        }),
      },
      path: '/claims/1234',
      reducers: reducer,
    });

    expect(
      screen.getByRole('heading', {
        name: /Your travel reimbursement claim/i,
        level: 1,
      }),
    ).to.exist;

    expect(screen.getByText(/Something went wrong on our end/i)).to.exist;
  });

  it('shows downtime alert during maintenance window', () => {
    const serviceMap = createServiceMap([
      {
        attributes: {
          externalService: 'travel_pay',
          status: 'down',
          startTime: format(subDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
          endTime: format(addDays(new Date(), 1), "yyyy-LL-dd'T'HH:mm:ss"),
        },
      },
    ]);

    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: {
        ...getState({
          detailsData: { '1234': { ...claimDetailsProps } },
        }),
        scheduledDowntime: {
          globalDowntime: null,
          isReady: true,
          isPending: false,
          serviceMap,
          dismissedDowntimeWarnings: [],
        },
      },
      path: '/claims/1234',
      reducers: reducer,
    });

    expect(screen.getByText(/is down for maintenance/i)).to.exist;
  });

  it('should render content when complex claims feature flag is disabled', () => {
    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: {
        ...getState({ detailsData: { '1234': { ...claimDetailsProps } } }),
        featureToggles: {
          loading: false,
          /* eslint-disable camelcase */
          travel_pay_power_switch: true,
          travel_pay_view_claim_details: true,
          travel_pay_enable_complex_claims: false,
          /* eslint-enable camelcase */
        },
      },
      path: '/claims/1234',
      reducers: reducer,
    });

    // Verify content still renders when complex claims is disabled
    expect(screen.getByText(/set up another direct deposit for VA travel pay/i))
      .to.exist;
    expect(screen.getByText(/deposit your funds in your bank account/i)).to
      .exist;
  });
});
