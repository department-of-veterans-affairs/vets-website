import React from 'react';

export const conditionsTitle =
  'Are any of your new conditions related to toxic exposure during your military service? Check any that are related.';
export const conditionsDescription = (
  <va-additional-info
    class="vads-u-margin-bottom--4"
    trigger="What is toxic exposure?"
  >
    <p>
      Toxic exposures include exposures to substances like Agent Orange, burn
      pits, radiation, asbestos, or contaminated water.
    </p>
    <br role="presentation" />
    <p>
      <va-link
        href="https://www.va.gov/resources/the-pact-act-and-your-va-benefits/"
        text="Learn more about toxic exposure"
      />
    </p>
  </va-additional-info>
);
