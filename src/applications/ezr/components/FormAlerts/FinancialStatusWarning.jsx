import React from 'react';
import { LAST_YEAR } from '../../utils/constants';

const FinancialStatusWarning = () => {
  const THIS_YEAR = LAST_YEAR + 1;
  const NEXT_YEAR = THIS_YEAR + 1;
  return (
    <va-alert
      status="warning"
      class="vads-u-margin-y--4"
      data-testid="ezr-financial-status-warning"
      uswds
    >
      <h3 slot="headline">You can skip questions on this form</h3>
      <div>
        <p>
          Our records show that you already shared your household financial
          information for {LAST_YEAR}. You can share your household financial
          information only once each year.
        </p>
        <p>
          Example: If you share your {LAST_YEAR} income in {THIS_YEAR}, you
          can’t share financial information again in {THIS_YEAR}. You’ll need to
          wait until {NEXT_YEAR} to share your {THIS_YEAR} information.
        </p>
        <p>
          You can use this form to update your personal or insurance
          information.
        </p>
        <p>If you’re struggling to pay your copays, you can request help.</p>
        <va-link
          href="/health-care/pay-copay-bill/financial-hardship/"
          text="Find out how to request financial hardship assistance"
        />
      </div>
    </va-alert>
  );
};

export default FinancialStatusWarning;
