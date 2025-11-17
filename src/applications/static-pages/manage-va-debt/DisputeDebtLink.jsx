import React from 'react';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

const disputeDebtUrl = getAppUrl('dispute-debt');

const DisputeDebtLink = () => {
  const {
    useToggleValue,
    useToggleLoadingValue,
    TOGGLE_NAMES,
  } = useFeatureToggle();
  const isLoadingFeatures = useToggleLoadingValue();
  const disputeDebtEnabled = useToggleValue(TOGGLE_NAMES.disputeDebt);

  if (isLoadingFeatures) {
    return (
      <va-loading-indicator
        label="Loading"
        message="Loading application..."
        set-focus
      />
    );
  }

  return (
    <>
      <h3>Overpayment debts</h3>
      <p>
        You’ll need to submit a written statement explaining why you think the
        debt is incorrect. If you dispute the debt within{' '}
        <strong>30 days</strong>, you can avoid collection actions.
      </p>
      {disputeDebtEnabled ? (
        <>
          <p>You can submit your dispute statement online or by mail.</p>
          <h4>Option 1: Online</h4>
          <va-link
            data-testid="dispute-debt-link"
            href={disputeDebtUrl}
            text="Dispute your VA debt"
          />
          <h4>Option 2: By mail</h4>
        </>
      ) : (
        <>
          <p>You can submit your dispute statement by mail.</p>
        </>
      )}
      {/* end debt section */}
      <p>Send your statement to this address:</p>
      <p className="va-address-block">
        Debt Management Center
        <br />
        P.O. Box 11930
        <br />
        St. Paul, MN 55111-0930
        <br />
      </p>
      <h3>Copay bills</h3>
      <p>
        You can start the process to dispute your copay bills by phone, by mail,
        or in person.
      </p>
      <va-link
        data-testid="dispute-copay-link"
        href="https://www.va.gov/health-care/pay-copay-bill/dispute-charges/"
        text="Learn more about disputing your VA copay charges"
      />
    </>
  );
};

export default DisputeDebtLink;
