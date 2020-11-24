import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';
import React from 'react';

export const netWorthCalculation = (
  <>
    <p>
      If you are entitled to a Veterans’ pension instead of disability
      compensation, VA needs to know the total value of your assets. If you're
      married, include the value of your spouse’s assets too.
    </p>
    <AdditionalInfo triggerText="How do I figure out my net worth?">
      <p>
        Your net worth includes all personal property you own (except your
        house, your car, and most home furnishings), minus any debt you owe.
        Your net worth includes the net worth of your spouse.
      </p>
    </AdditionalInfo>
  </>
);

export const netWorthTitle = (
  <p>
    Did the household have a <strong>net worth</strong> greater than $129,094 in
    the last tax year?
  </p>
);
