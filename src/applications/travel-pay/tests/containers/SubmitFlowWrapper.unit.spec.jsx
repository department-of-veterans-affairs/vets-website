import React from 'react';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import { expect } from 'chai';
import SubmitFlowWrapper from '../../containers/SubmitFlowWrapper';

describe('SubmitFlowWrapper', () => {
  const getData = ({
    areFeatureTogglesLoading = true,
    hasFeatureFlag = true,
    hasClaimDetailsFeatureFlag = true,
    canSubmitMileageExpense = true,
    isLoggedIn = true,
  } = {}) => {
    return {
      featureToggles: {
        loading: areFeatureTogglesLoading,
        /* eslint-disable camelcase */
        travel_pay_power_switch: hasFeatureFlag,
        travel_pay_view_claim_details: hasClaimDetailsFeatureFlag,
        travel_pay_submit_mileage_expense: canSubmitMileageExpense,
        /* eslint-enable camelcase */
      },
      user: {
        login: {
          currentlyLoggedIn: isLoggedIn,
        },
      },
    };
  };

  it('should render loading state if feature flags are loading', async () => {
    const screen = renderWithStoreAndRouter(<SubmitFlowWrapper />, {
      initialState: getData({
        areFeatureTogglesLoading: true,
      }),
      path: `/file-new-claim/12345`,
    });
    expect(await screen.getByTestId('travel-pay-loading-indicator')).to.exist;
  });

  it('should initially load child Introduction Page component', () => {
    const screen = renderWithStoreAndRouter(<SubmitFlowWrapper />, {
      initialState: getData({
        areFeatureTogglesLoading: false,
      }),
      path: `/file-new-claim/12345`,
    });
    expect(screen.getByText('File a travel reimbursement claim')).to.exist;
  });
});
