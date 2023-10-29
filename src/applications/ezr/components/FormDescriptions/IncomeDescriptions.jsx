import React from 'react';

export const GrossIncomeDescription = (
  <>
    <div className="vads-u-margin-y--1">
      Gross income is income before taxes and any other deductions are
      subtracted.
    </div>

    <va-additional-info
      trigger="What we consider gross annual income"
      class="vads-u-margin-y--1"
    >
      <div>
        <p className="vads-u-font-weight--bold vads-u-margin-top--0">
          Gross income includes these types of income from a job:
        </p>
        <ul className="vads-u-margin-bottom--0">
          <li>Wages</li>
          <li>Bonuses</li>
          <li>Tips</li>
          <li>Severance pay</li>
        </ul>
      </div>
    </va-additional-info>
  </>
);

export const OtherIncomeDescription = (
  <>
    <div className="vads-u-margin-y--1">
      Other income is additional income that doesn’t come from a job.
    </div>

    <va-additional-info
      trigger="What we consider other annual income"
      class="vads-u-margin-y--1"
    >
      <div>
        <p className="vads-u-font-weight--bold vads-u-margin-top--0">
          Other income includes things like this:
        </p>
        <ul className="vads-u-margin-bottom--0">
          <li>Retirement benefits</li>
          <li>Unemployment</li>
          <li>VA benefit compensation</li>
          <li>Money from the sale of a house</li>
          <li>Interest from investments</li>
        </ul>
      </div>
    </va-additional-info>
  </>
);
