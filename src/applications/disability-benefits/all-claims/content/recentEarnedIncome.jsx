import React from 'react';

import AdditionalInfo from '@department-of-veterans-affairs/formation/AdditionalInfo';

export const grossIncomeAdditionalInfo = () => (
  <AdditionalInfo triggerText="What is gross income?">
    <p>
      Gross income is money earned from employment before taxes. It includes
      military pay. It doesn't include Social Security benefits, VA benefits,
      stock dividends, or investment income.
    </p>
  </AdditionalInfo>
);
