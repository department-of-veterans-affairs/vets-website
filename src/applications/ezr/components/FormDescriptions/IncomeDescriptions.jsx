import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/helpers/general';
import { LAST_YEAR } from '../../utils/constants';

export const FinancialInformationReviewAlert = () => {
  return (
    <>
      <div className="vads-u-margin-top--4">
        <va-alert slim status="warning" tabIndex={-1} visible>
          <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
            You can review and edit your financial information. Or select{' '}
            <strong>Continue</strong> to go to the next part of this form.
          </p>
        </va-alert>
      </div>
    </>
  );
};

export const HouseholdFinancialOnboarding = () => {
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

const PreviousIncome = props => {
  const { incomeType, isVeteran } = props;
  const { previousFinancialInfo } = useSelector(
    state => state?.enrollmentStatus?.nonPrefill,
  );
  const income = isVeteran
    ? `${previousFinancialInfo?.veteranFinancialInfo?.[`${incomeType}`]}`
    : `${previousFinancialInfo?.spouseFinancialInfo?.[`${incomeType}`]}`;

  return (isVeteran && previousFinancialInfo?.veteranFinancialInfo) ||
    (!isVeteran && previousFinancialInfo?.spouseFinancialInfo) ? (
    <>
      <div className="vads-u-background-color--gray-lightest vads-u-margin-y--4">
        <va-card background>
          <h4 className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Your {isVeteran ? '' : "spouse's"}{' '}
            {incomeType
              .split('Income')
              .join(' ')
              .toLowerCase()}{' '}
            income from{' '}
            {isVeteran
              ? previousFinancialInfo?.veteranFinancialInfo?.incomeYear
              : previousFinancialInfo?.spouseFinancialInfo?.incomeYear}
          </h4>
          <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
            {formatCurrency(income)}
          </p>
        </va-card>
      </div>
    </>
  ) : null;
};

PreviousIncome.propTypes = {
  incomeType: PropTypes.string,
  isVeteran: PropTypes.bool,
};

// eslint-disable-next-line react/prop-types
export const GrossIncomeDescription = (isVeteran = true) => {
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
      <PreviousIncome incomeType={incomeType} isVeteran={isVeteran} />
    </>
  );
};

export const PreviousNetIncome = (isVeteran = true) => {
  const incomeType = 'netIncome';

  return (
    <>
      <PreviousIncome incomeType={incomeType} isVeteran={isVeteran} />
    </>
  );
};

export const OtherIncomeDescription = (isVeteran = true) => {
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
      <PreviousIncome incomeType={incomeType} isVeteran={isVeteran} />
    </>
  );
};
