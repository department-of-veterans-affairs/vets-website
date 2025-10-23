import React from 'react';
import { PreviousIncome } from '../SupplementalFormContent/PreviousFinancialInfo';

/**
 * @param {String} incomeReceiver - The person who received the gross income
 */
export const GrossIncomeDescription = incomeReceiver => {
  const incomeType = 'grossIncome';

  return (
    <>
      <va-additional-info
        trigger="What we consider gross annual income"
        class="vads-u-margin-top--1 vads-u-margin-bottom--4 hydrated"
        uswds
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
      <PreviousIncome incomeType={incomeType} incomeReceiver={incomeReceiver} />
    </>
  );
};

/**
 * @param {String} incomeReceiver - The person who received the gross income
 */
export const PreviousNetIncome = incomeReceiver => {
  const incomeType = 'netIncome';

  return (
    <PreviousIncome incomeType={incomeType} incomeReceiver={incomeReceiver} />
  );
};

/**
 * @param {String} incomeReceiver - The person who received the gross income
 */
export const OtherIncomeDescription = incomeReceiver => {
  const incomeType = 'otherIncome';

  return (
    <>
      <va-additional-info
        trigger="What we consider other annual income"
        class="vads-u-margin-top--1 vads-u-margin-bottom--4 hydrated"
        uswds
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
      <PreviousIncome incomeType={incomeType} incomeReceiver={incomeReceiver} />
    </>
  );
};
