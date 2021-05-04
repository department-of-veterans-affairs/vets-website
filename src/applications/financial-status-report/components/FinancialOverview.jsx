import React from 'react';
import { connect } from 'react-redux';
import { getMonthlyIncome, getMonthlyExpenses } from '../utils/helpers';

const FinancialOverview = ({ formData }) => {
  const monthlyIncome = getMonthlyIncome(formData);
  const monthlyExpenses = getMonthlyExpenses(formData);
  const incomeMinusExpenses = monthlyIncome - monthlyExpenses;
  const totalIncome = incomeMinusExpenses > 0 ? incomeMinusExpenses : 0;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <>
      <div className="usa-alert usa-alert-info background-color-only">
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Your financial overview
        </h4>
        <div className="vads-u-margin-bottom--1 overview-container">
          <div>Total monthly income:</div>
          <div>{formatter.format(parseFloat(monthlyIncome))}</div>
        </div>
        <div className="vads-u-margin-bottom--1 overview-container">
          <div>Total monthly taxes and expenses:</div>
          <div>{formatter.format(parseFloat(monthlyExpenses))}</div>
        </div>
        <div className="vads-u-margin-bottom--0 overview-container">
          <div>Income after taxes and expenses:</div>
          <div>{formatter.format(parseFloat(totalIncome))}</div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = ({ form }) => ({
  formData: form.data,
});

export default connect(mapStateToProps)(FinancialOverview);
