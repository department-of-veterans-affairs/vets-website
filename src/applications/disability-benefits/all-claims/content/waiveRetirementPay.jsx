import React from 'react';

export const waiveRetirementPayDescription = (
  <div>
    <p>
      If you’re eligible for both retirement pay and VA compensation pay, you
      can choose whether you want to receive VA compensation pay to balance your
      retirement pay or get your full retirement pay at the current tax rate.
    </p>
    <p>
      VA compensation pay isn’t taxable. Military retirement pay is taxable.{' '}
      <strong>
        Dollar for dollar, VA compensation pay is always the greater benefit.
      </strong>
    </p>
    <p>
      The chart below shows an example of what your total monthly pay could be
      depending on if you choose compensation pay versus retirement pay. The tax
      rates below are estimated and will vary depending on income.
    </p>
    <va-table>
      <va-table-row slot="headers">
        <span> </span>
        <span>Compensation pay</span>
        <span>Retirement pay</span>
      </va-table-row>
      <va-table-row>
        <span>Monthly base pay example</span>
        <span>$700</span>
        <span>$700</span>
      </va-table-row>
      <va-table-row>
        <span>Estimated taxes per month</span>
        <span>$0 (tax-free)</span>
        <span>$70</span>
      </va-table-row>
      <va-table-row>
        <strong>Total monthly pay example</strong>
        <strong>$700</strong>
        <strong>$630</strong>
      </va-table-row>
    </va-table>
    <p>
      <strong>Please note: </strong>
      If your combined disability rating eventually exceeds 50%, you may be
      eligible for Concurrent Retirement Disability Pay (CRDP), which lets you
      receive your full military retirement pay and full compensation at the
      same time. Your military retirement pay won’t be reduced.
    </p>
  </div>
);
