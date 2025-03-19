import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import TravelClaimDetails from '../../components/TravelClaimDetails';
import reducer from '../../redux/reducer';

describe('TravelClaimDetails', () => {
  const claimDetailsProps = {
    claimId: '20d73591-ff18-4b66-9838-1429ebbf1b6e',
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
    hasClaimsManagementFlag = true,
    loadingDetails = false,
    detailsError = null,
    detailsData = {},
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

  it('Successfully renders', () => {
    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: {
        ...getState({ detailsData: { '1234': { ...claimDetailsProps } } }),
      },
      path: '/claims/1234',
      reducers: reducer,
    });

    expect(
      screen.getByText(
        /If you're eligible for reimbursement, we'll deposit your reimbursement in your bank account./i,
      ),
    );
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

  it('handles failed data fetching and displays an error', () => {
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

    expect(screen.getByText(/There was an error loading the claim details/i)).to
      .exist;
  });

  it('renders appeal link for denied claims', async () => {
    global.fetch.restore();
    mockApiRequest({ ...claimDetailsProps, claimStatus: 'Denied' });

    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: getState(),
    });

    expect(await screen.findByText('Claim status: Denied')).to.exist;
    expect(
      $('va-link[text="Appeal the claim decision"][href="/decision-reviews"]'),
    ).to.exist;
  });

  it('does not render claims management content with flag off', async () => {
    global.fetch.restore();
    mockApiRequest({ ...claimDetailsProps, claimStatus: 'Denied' });

    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: getState({ hasClaimsManagementFlag: false }),
    });

    expect(await screen.findByText('Claim status: Denied')).to.exist;
    expect(
      $('va-link[text="Appeal the claim decision"][href="/decision-reviews"]'),
    ).to.not.exist;
  });
});
