import React from 'react';
import { LAST_YEAR } from '../../utils/constants';

export const FinancialInformationIntroduction = () => {
  return (
    <>
      <p>
        Here’s what income information you’ll need to fill out this section:
      </p>

      <ul>
        <li>
          <strong>Gross annual income from work.</strong> Gross income is income
          before taxes and any other deductions. This includes income from a job
          like wages, bonuses, tips, and severance pay.
        </li>
        <li>
          <strong>Net income from a farm, property, or business.</strong> Net
          income is income after taxes and deductions are subtracted.
        </li>
        <li>
          <strong>Other annual income received.</strong> This includes things
          like retirement benefits, unemployment, VA benefit compensation, money
          from the sale of a house, or interest from investments.
        </li>
      </ul>

      <p>
        And we’ll ask for you or your spouse’s deductible expenses from{' '}
        {LAST_YEAR}.
      </p>

      <p className="vads-u-font-weight--bold">
        Here’s what deductible information you can include in this section:
      </p>

      <ul>
        <li>Certain health care or education costs</li>
        <li>Funeral or burial expenses for a spouse or dependent child</li>
      </ul>

      <p>
        These deductible expenses will lower the amount of money we count as
        your income.
      </p>
    </>
  );
};
