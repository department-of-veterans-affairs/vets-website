import React from 'react';

import {
  dmcPhoneContent,
  healthResourceCenterPhoneContent,
} from '../utils/helpers';

const ZeroDebtsCopaysSection = () => {
  return (
    <>
      <h2>You don’t have any outstanding overpayments or copay bills</h2>
      <p>
        Our records show you don’t have any outstanding overpayments related to
        VA benefits and you haven’t received a copay bill in the past 6 months.
      </p>
      <h3>What to do if you think you have an overpayment or copay bill</h3>
      <ul>
        <li>
          <strong>For overpayments</strong>, call the Debt Management Center
          (DMC) at {dmcPhoneContent()}
        </li>
        <li>
          <strong>For medical copay bills</strong>, call the VA Health Resource
          Center at {healthResourceCenterPhoneContent()}
        </li>
      </ul>
      <va-link
        active
        class="vads-u-margin-top--2"
        data-testid="return-to-va-link"
        href="https://va.gov"
        text="Return to VA.gov"
      />
    </>
  );
};
export default ZeroDebtsCopaysSection;
