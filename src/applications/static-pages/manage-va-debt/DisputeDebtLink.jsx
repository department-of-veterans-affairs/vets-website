import React from 'react';
import { getAppUrl } from 'platform/utilities/registry-helpers';
import { useFeatureToggle } from 'platform/utilities/feature-toggles/useFeatureToggle';

const disputeDebtUrl = getAppUrl('dispute-debt');

const DisputeDebtLink = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();
  const disputeDebtEnabled = useToggleValue(TOGGLE_NAMES.disputeDebt);

  if (!disputeDebtEnabled) {
    return null;
  }

  return (
    <>
      <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
        <va-link
          data-testid="dispute-debt-link"
          href={disputeDebtUrl}
          text="Dispute your VA overpayments"
        />
      </h3>
      <p>
        If you disagree with the charges or amounts on your overpayment bill,
        you can file a dispute.
      </p>
      <h3 className="va-nav-linkslist-title vads-u-font-size--h4">
        <va-link
          data-testid="dispute-copay-link"
          href="https://www.va.gov/health-care/pay-copay-bill/dispute-charges/"
          text="Dispute your VA copay charges"
        />
      </h3>
      <p>
        You have the right to dispute all or part of your VA copay charges. To
        avoid late charges, you’ll need to dispute the debt within 30 days of
        receiving your bill.
      </p>
    </>
  );
};

export default DisputeDebtLink;
