// Dependencies.
import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';

import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';
import { renderWithStoreAndRouter } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';

import AuthContext from '.';

describe('AuthContext', () => {
  const getToggles = ({
    areFeatureTogglesLoading = true,
    hasFeatureFlag = true,
    hasSmocFeatureFlag = false,
  } = {}) => {
    return {
      featureToggles: {
        loading: areFeatureTogglesLoading,
        /* eslint-disable camelcase */
        travel_pay_power_switch: hasFeatureFlag,
        travel_pay_submit_mileage_expense: hasSmocFeatureFlag,
        /* eslint-enable camelcase */
      },
    };
  };

  it('renders the va.gov link when app enabled', async () => {
    const screen = renderWithStoreAndRouter(<AuthContext />, {
      initialState: getToggles({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
      }),
    });
    await waitFor(() => {
      expect(screen.getByTestId('btsss-link')).to.exist;
      expect(screen.getByTestId('vagov-travel-pay-link')).to.exist;
      expect(
        screen.findByText(
          'You can also check your travel claim status here on VA.gov',
        ),
      ).to.exist;
    });

    screen.unmount();
  });

  it('does not render the va.gov link when app not enabled', async () => {
    const screen = renderWithStoreAndRouter(<AuthContext />, {
      initialState: getToggles({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: false,
      }),
    });
    await waitFor(() => {
      expect(screen.getByTestId('btsss-link')).to.exist;
      expect(screen.queryAllByTestId('vagov-travel-pay-link').length).to.eq(0);
      expect(
        screen.queryByText(
          'You can also check your travel claim status here on VA.gov',
        ),
      ).to.be.null;
    });

    screen.unmount();
  });

  it('should render loading while toggles settle', async () => {
    const screen = renderWithStoreAndRouter(<AuthContext />, {
      initialState: getToggles({
        areFeatureTogglesLoading: true,
        hasFeatureFlag: true,
      }),
    });

    expect(await screen.getByTestId('btsss-login-loading-indicator')).to.exist;
    screen.unmount();
  });

  it('should render appointments link with SMOC flag', async () => {
    const screen = renderWithStoreAndRouter(<AuthContext />, {
      initialState: getToggles({
        areFeatureTogglesLoading: false,
        hasFeatureFlag: true,
        hasSmocFeatureFlag: true,
      }),
    });
    await waitFor(() => {
      expect(screen.getByTestId('btsss-link')).to.exist;
      expect(screen.getByTestId('vagov-travel-pay-link')).to.exist;
      expect(screen.getByTestId('vagov-smoc-link')).to.exist;

      expect(
        $(
          'va-link-action[href="/my-health/appointments/past"][text="Go to your past appointments"]',
        ),
      ).to.exist;
      expect(
        $(
          'va-link[href="https://dvagov-btsss.dynamics365portals.us/signin"][text="Go to BTSSS"]',
        ),
      ).to.exist;
      expect(
        $(
          'va-link-action[href="/my-health/travel-pay/claims"][text="Review your travel claims"]',
        ),
      ).to.exist;
    });

    screen.unmount();
  });
});
