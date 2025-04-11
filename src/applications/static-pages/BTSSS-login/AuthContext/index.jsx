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
  const smocEnabled = useToggleValue(
    TOGGLE_NAMES.travelPaySubmitMileageExpense,
  );

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
      {smocEnabled ? (
        <>
          <va-link-action
            data-testid="vagov-smoc-link"
            href="/my-health/appointments/past"
            text="Go to your past appointments"
          />
          <p>
            <strong>
              If you need to submit receipts for other expenses, like tolls,
              meals, or lodging
            </strong>
            , you can file your travel claim through the Beneficiary Travel
            Self-Service System (BTSSS).
          </p>
          <va-link
            data-testid="btsss-link"
            href="https://dvagov-btsss.dynamics365portals.us/signin"
            text="Go to BTSSS"
            label="Go to the Beneficiary Travel Self-Service System (BTSSS)"
          />
          <p>
            <strong>
              If you want to check the status of all your travel claims
            </strong>
            , you can do that here on VA.gov.
          </p>
          <va-link-action
            data-testid="vagov-travel-pay-link"
            type="secondary"
            href="/my-health/travel-pay/claims"
            text="Review your travel claims"
          />
        </>
      ) : (
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
      )}
    </>
  );
};

export default AuthContext;
