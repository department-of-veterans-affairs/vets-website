import React from 'react';
import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const incomeDescription = (
  <div>
    <h5>Income details</h5>
    <p>
      Now we’re going to ask you about your income history. Please provide your
      gross income, which is all the money you earned through employment for the
      year before taxes. If you can’t remember the exact dollar amount, you can
      give an estimated amount.
    </p>
    <AdditionalInfo triggerText={`What’s included in "gross income"?`}>
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
