import React from 'react';
import { expect } from 'chai';

import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import ClaimDetailsContent from '../../components/ClaimDetailsContent';

describe('ClaimDetailsContent', () => {
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

  it('Successfully renders', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent {...claimDetailsProps} />,
      {
        initialState: getState(),
      },
    );

    expect(
      screen.getByText(
        'Your travel reimbursement claim for Sunday, May 26, 2024',
      ),
    ).to.exist;
    expect(screen.getByText('Claim number: TC0928098230498')).to.exist;
    expect(screen.getByText('Tomah VA Medical Center')).to.exist;
    expect(screen.getByText('Claim status: Claim submitted')).to.exist;
  });

  it('renders appeal link for denied claims', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent {...claimDetailsProps} claimStatus="Denied" />,
      {
        initialState: getState(),
      },
    );

    expect(screen.getByText('Claim status: Denied')).to.exist;
    expect(
      $('va-link[text="Appeal the claim decision"][href="/decision-reviews"]'),
    ).to.exist;
  });

  it('does not render claims management content with flag off', () => {
    const screen = renderWithStoreAndRouter(
      <ClaimDetailsContent {...claimDetailsProps} claimStatus="Denied" />,
      {
        initialState: getState({ hasClaimsManagementFlag: false }),
      },
    );

    expect(screen.getByText('Claim status: Denied')).to.exist;
    expect(
      $('va-link[text="Appeal the claim decision"][href="/decision-reviews"]'),
    ).to.not.exist;
  });
});
