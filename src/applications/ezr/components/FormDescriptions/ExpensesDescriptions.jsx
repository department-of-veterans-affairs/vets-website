import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/helpers/general';

const PreviousExpenses = props => {
  const { formData, expensesType } = props;
  const { nonPrefill: previousFinancialInfo } = formData;
  const expensesText = {
    deductibleMedicalExpenses: 'non-reimbursable medical',
    deductibleEducationExpenses: 'education',
    deductibleFuneralExpenses: 'funeral and burial',
  };
  const veteranFinancialInfo = previousFinancialInfo?.veteranFinancialInfo;
  const incomeYear = veteranFinancialInfo?.incomeYear;
  const expense = veteranFinancialInfo?.[`${expensesType}`];

  return expense !== null && incomeYear !== null ? (
    <>
      <div className="vads-u-background-color--gray-lightest vads-u-margin-y--4">
        <va-card background>
          <h4 className="vads-u-margin-y--0 vads-u-font-weight--bold">
            Your {expensesText[`${expensesType}`]} expenses in {incomeYear}
          </h4>
          <p className="vads-u-margin-y--0">{formatCurrency(expense)}</p>
        </va-card>
      </div>
    </>
  ) : null;
};

PreviousExpenses.propTypes = {
  expensesType: PropTypes.string,
  formData: PropTypes.object,
};

export const EducationalExpensesDescription = () => {
  const expensesType = 'deductibleEducationExpenses';

  return (
    <>
      <va-additional-info
        trigger="What we consider college or vocational expenses"
        class="vads-u-margin-y--1 hydrated"
        uswds
      >
        <div>
          <p className="vads-u-margin-top--0">
            College and vocational expenses include payments for these expenses
            related to your own education:
          </p>
          <ul>
            <li>Tuition</li>
            <li>Books</li>
            <li>Fees</li>
            <li>Course materials</li>
          </ul>
          <p className="vads-u-margin-bottom--0">
            Only include expenses for your own education (not your dependents’
            education).
          </p>
        </div>
      </va-additional-info>
      <PreviousExpenses expensesType={expensesType} />
    </>
  );
};

export const MedicalExpensesDescription = () => {
  const expensesType = 'deductibleMedicalExpenses';

  return (
    <>
      <va-additional-info
        trigger="What we consider non-reimbursable medical expenses"
        class="vads-u-margin-top--1 vads-u-margin-bottom--4 hydrated"
      >
        <div>
          <p className="vads-u-margin-top--0">
            Non-reimbursable medical expenses include costs you or your spouse
            paid for these types of health care for yourselves, your dependents,
            or others you have the moral obligation to support:
          </p>
          <ul>
            <li>Doctor or dentist appointments</li>
            <li>Medications</li>
            <li>Medicare or health insurance</li>
            <li>Inpatient hospital care</li>
            <li>Nursing home care</li>
          </ul>
          <p className="vads-u-margin-bottom--0">
            We only consider expenses non-reimbursable if your health insurance
            doesn’t pay you back for the cost.
          </p>
        </div>
      </va-additional-info>
      <PreviousExpenses expensesType={expensesType} />
    </>
  );
};

export const PreviousFuneralExpenses = () => {
  const expensesType = 'deductibleFuneralExpenses';

  return (
    <>
      <PreviousExpenses expensesType={expensesType} />
    </>
  );
};
