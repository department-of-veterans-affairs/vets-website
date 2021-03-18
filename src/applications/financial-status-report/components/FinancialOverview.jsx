import React from 'react';
import { connect } from 'react-redux';
import { getMonthlyIncome, getMonthlyExpenses } from '../utils/helpers';

const FinancialOverview = ({ formData }) => {
  const { selectedDebts } = formData;
  const monthlyIncome = getMonthlyIncome(formData);
  const monthlyExpenses = getMonthlyExpenses(formData);
  const totalIncome = monthlyIncome - monthlyExpenses;
  const index = window.location.href.slice(-1);
  const debt = selectedDebts[index];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <>
      <h4>Your financial overview</h4>
      <div className="usa-alert usa-alert-info background-color-only vads-u-margin-bottom--5">
        <div className="vads-u-margin-bottom--1 overview-container">
          <div>Total monthly income:</div>
          <div>
            {debt.currentAr && formatter.format(parseFloat(monthlyIncome))}
          </div>
        </div>
        <div className="vads-u-margin-bottom--1 overview-container">
          <div>Total monthly taxes and expenses:</div>
          <div>
            {debt.currentAr && formatter.format(parseFloat(monthlyExpenses))}
          </div>
        </div>
        <div className="vads-u-margin-bottom--0 overview-container">
          <div>Income after taxes and expenses:</div>
          <div>
            {debt.currentAr && formatter.format(parseFloat(totalIncome))}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(FinancialOverview);
