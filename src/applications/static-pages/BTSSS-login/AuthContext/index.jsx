import React from 'react';

const AuthContext = () => {
  return (
    <>
      <p>
        <strong>If you’re claiming mileage only</strong>, you can file a travel
        claim for eligible past appointments here on VA.gov.
      </p>
      <va-link-action
        data-testid="vagov-smoc-link"
        href="/my-health/appointments/past"
        text="Go to your past appointments"
      />
      <p>
        <strong>
          If you need to submit receipts for other expenses, like tolls, meals,
          or lodging
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
  );
};

export default AuthContext;
