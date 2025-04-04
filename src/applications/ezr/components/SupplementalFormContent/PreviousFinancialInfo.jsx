import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../../utils/helpers/general';

export const PreviousIncome = props => {
  const { data: formData } = useSelector(state => state.form);

  if (!formData['view:isProvidersAndDependentsPrefillEnabled']) {
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

export const PreviousExpenses = props => {
  const { data: formData } = useSelector(state => state.form);

  if (!formData['view:isProvidersAndDependentsPrefillEnabled']) {
    return null;
  }

  const { expensesType } = props;
  const { previousFinancialInfo } = formData?.nonPrefill || {};
  const veteranFinancialInfo = previousFinancialInfo?.veteranFinancialInfo;
  const incomeYear = veteranFinancialInfo?.incomeYear;
  const expense = veteranFinancialInfo?.[`${expensesType}`];
  const expensesText = {
    deductibleMedicalExpenses: 'non-reimbursable medical',
    deductibleEducationExpenses: 'education',
    deductibleFuneralExpenses: 'funeral and burial',
  };

  return expense && incomeYear ? (
    <>
      <div className="vads-u-background-color--gray-lightest vads-u-margin-y--4">
        <va-card background>
          <h4 className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Your {expensesText[`${expensesType}`]} expenses from {incomeYear}
          </h4>
          <p className="vads-u-margin-top--2 vads-u-margin-bottom--0">
            {formatCurrency(expense)}
          </p>
        </va-card>
      </div>
    </>
  ) : null;
};

PreviousExpenses.propTypes = {
  expensesType: PropTypes.string,
};
