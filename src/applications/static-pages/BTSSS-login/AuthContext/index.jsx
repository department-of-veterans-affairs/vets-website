import React from 'react';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

const AuthContext = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();

  const toggleIsLoading = useToggleLoadingValue();
  const appEnabled = useToggleValue(TOGGLE_NAMES.travelPayPowerSwitch);

  if (toggleIsLoading) {
    return (
      <div className="vads-l-grid-container vads-u-padding-y--3">
        <va-loading-indicator
          label="Loading"
          message="Please wait."
          data-testid="btsss-login-loading-indicator"
        />
      </div>
    );
  }

  return (
    <>
      <va-link-action
        data-testid="btsss-link"
        href="https://dvagov-btsss.dynamics365portals.us/signin"
        text="Go to BTSSS to file a claim"
      />
      {appEnabled && (
        <>
          <p>You can also check your travel claim status here on VA.gov</p>
          <va-link-action
            data-testid="vagov-travel-pay-link"
            type="secondary"
            href="/my-health/travel-pay/claims"
            text="Check your travel claim status"
          />
        </>
      )}
    </>
  );
};

export default AuthContext;
