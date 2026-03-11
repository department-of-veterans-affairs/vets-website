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
          <p>
            Go to your list of past appointments to file a travel reimbursement
            claim for eligible appointments.
          </p>
          <va-link-action
            data-testid="vagov-smoc-link"
            href="/my-health/appointments/past"
            text="Go to your past appointments"
          />
          <p>
            Or you can check the status of all your travel reimbursement claims.
          </p>
          <va-link-action
            data-testid="vagov-travel-pay-link"
            type="secondary"
            href="/my-health/travel-pay/claims"
            text="Review your travel reimbursement claims"
          />
          <p>
            <strong>
              You’ll need to use the Beneficiary Travel Self Service System
              (BTSSS) if any of these things are true:
            </strong>
          </p>
          <ul>
            <li>You don’t see your appointment in your appointments list</li>
            <li>Your travel was one way</li>
            <li>
              Your travel started from an address other than the one we have on
              file
            </li>
          </ul>
          <va-link
            data-testid="btsss-link"
            href="https://dvagov-btsss.dynamics365portals.us/signin"
            text="Go to BTSSS website"
            label="Go to the Beneficiary Travel Self-Service System (BTSSS)"
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
