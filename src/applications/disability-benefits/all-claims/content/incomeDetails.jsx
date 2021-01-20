import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import { recordEventOnce } from 'platform/monitoring/record-event';

const helpClicked = () =>
  recordEventOnce({
    event: 'disability-526EZ--form-help-text-clicked',
    'help-text-label':
      'Disability - Form 526EZ - What is included in gross income',
  });

export const incomeDescription = (
  <div>
    <h3 className="vads-u-font-size--h4">Income details</h3>
    <p>
      Now we’re going to ask you about your income history. Please provide your
      gross income, which is all the money you earned through employment for the
      year before taxes. If you can’t remember the exact dollar amount, you can
      give an estimated amount.
    </p>
    <AdditionalInfo
      triggerText={`What’s included in "gross income"?`}
      onClick={helpClicked}
    >
      <p>
        You should include all the money you earned - before taxes - including
        military pay. You don’t need to include:
      </p>
      <ul>
        <li>Social Security benefits</li>
        <li>VA benefits</li>
        <li>Stock dividends</li>
        <li>Investment income.</li>
      </ul>
    </AdditionalInfo>
  </div>
);
