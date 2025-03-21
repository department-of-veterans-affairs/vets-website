import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { mockApiRequest } from '@department-of-veterans-affairs/platform-testing/helpers';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import TravelClaimDetails from '../../components/TravelClaimDetails';

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
    hasClaimsManagementFlag = true,
  } = {}) => ({
    featureToggles: {
      loading: featureTogglesAreLoading,
      /* eslint-disable camelcase */
      travel_pay_power_switch: hasStatusFeatureFlag,
      travel_pay_view_claim_details: hasDetailsFeatureFlag,
      travel_pay_claims_management: hasClaimsManagementFlag,
      /* eslint-enable camelcase */
    },
  });

  let oldLocation;
  beforeEach(() => {
    oldLocation = global.window.location;
    delete global.window.location;

    global.window.location = {
      replace: sinon.spy(),
    };
    mockApiRequest({ ...claimDetailsProps });
  });

  afterEach(() => {
    global.window.location = oldLocation;
  });

  it('Successfully renders', async () => {
    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: getState(),
    });

    await waitFor(() => {
      expect(screen.queryByText('Claim number: TC0928098230498')).to.exist;
    });
  });

  it('redirects to the root path when claim statuses feature flag is false', async () => {
    renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: getState({ hasStatusFeatureFlag: false }),
    });

    await waitFor(() => {
      expect(window.location.replace.calledWith('/')).to.be.true;
    });
  });
  it('redirects to claim details when claim details feature flag is false', async () => {
    renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: getState({ hasDetailsFeatureFlag: false }),
    });

    await waitFor(() => {
      expect(window.location.replace.calledWith('/my-health/travel-pay')).to.be
        .true;
    });
  });
  it('handles failed data fetching and displays an error', async () => {
    global.fetch.restore();
    mockApiRequest({ errors: [{ title: 'Bad Request', status: 400 }] }, false);

    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: getState(),
    });

    await waitFor(() => {
      expect(
        screen.queryByText('There was an error loading the claim details.'),
      ).to.exist;
    });
  });

  it('renders reimbursement amount if one is provided', async () => {
    global.fetch.restore();
    mockApiRequest({ ...claimDetailsProps, reimbursementAmount: 46.93 });

    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: getState(),
    });
    await waitFor(() => {
      expect(screen.getByText('Reimbursement amount of $46.93')).to.exist;
    });
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
    mockApiRequest({
      ...claimDetailsProps,
      claimStatus: 'Denied',
      reimbursementAmount: 1.0,
    });

    const screen = renderWithStoreAndRouter(<TravelClaimDetails />, {
      initialState: getState({ hasClaimsManagementFlag: false }),
    });

    expect(await screen.findByText('Claim status: Denied')).to.exist;
    expect(
      $('va-link[text="Appeal the claim decision"][href="/decision-reviews"]'),
    ).to.not.exist;
    expect(screen.queryByText('Reimbursement amount of $1.00')).to.not.exist;
  });
});
