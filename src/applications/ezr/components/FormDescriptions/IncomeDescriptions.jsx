import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers/general';
import { includeHouseholdInformationWithV2Prefill } from '../../utils/helpers/form-config';

const PreviousIncome = props => {
  const { data: formData } = useSelector(state => state.form);

  if (!includeHouseholdInformationWithV2Prefill(formData)) {
    return null;
  }

  const { incomeReceiver, incomeType } = props;
  const { previousFinancialInfo } = formData.nonPrefill || {};
  const financialInfo =
    previousFinancialInfo?.[`${incomeReceiver}FinancialInfo`];
  const incomeYear = financialInfo?.incomeYear;
  const income = financialInfo?.[`${incomeType}`];

  return incomeYear && income ? (
    <>
      <div className="vads-u-background-color--gray-lightest vads-u-margin-y--4">
        <va-card background>
          <h4 className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Your {incomeReceiver !== 'veteran' ? `${incomeReceiver}'s ` : ''}
            {incomeType
              .split('Income')
              .join(' ')
              .toLowerCase()}
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
  incomeReceiver: PropTypes.string,
  incomeType: PropTypes.string,
};

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
    <>
      <PreviousIncome incomeType={incomeType} incomeReceiver={incomeReceiver} />
    </>
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
