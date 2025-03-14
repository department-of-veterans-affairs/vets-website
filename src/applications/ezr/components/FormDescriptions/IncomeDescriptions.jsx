import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/helpers/general';

const PreviousIncome = props => {
  const { formData, incomeType, isVeteran } = props;
  const { previousFinancialInfo } = formData;
  const { veteranFinancialInfo, spouseFinancialInfo } = previousFinancialInfo;
  const incomeYear = isVeteran
    ? veteranFinancialInfo?.incomeYear
    : spouseFinancialInfo?.incomeYear;
  const income = isVeteran
    ? veteranFinancialInfo?.[`${incomeType}`]
    : spouseFinancialInfo?.[`${incomeType}`];

  return incomeYear !== null &&
    ((isVeteran && income !== null) || (!isVeteran && income !== null)) ? (
    <>
      <div className="vads-u-background-color--gray-lightest vads-u-margin-y--4">
        <va-card background>
          <h4 className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Your {isVeteran ? '' : "spouse's"}{' '}
            {incomeType
              .split('Income')
              .join(' ')
              .toLowerCase()}{' '}
            income from {incomeYear}
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
  formData: PropTypes.object,
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
