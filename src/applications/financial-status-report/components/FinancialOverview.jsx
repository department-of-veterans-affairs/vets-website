import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  currency,
  getMonthlyIncome,
  getMonthlyExpenses,
} from '../utils/helpers';

const FinancialOverview = ({ formData }) => {
  const monthlyIncome = getMonthlyIncome(formData);
  const monthlyExpenses = getMonthlyExpenses(formData);
  const incomeMinusExpenses = monthlyIncome - monthlyExpenses;

  return (
    <>
      <div className="usa-alert usa-alert-info background-color-only">
        <h4 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Your financial overview
        </h4>
        <div className="vads-u-margin-bottom--1 overview-container">
          <div>Total monthly income:</div>
          <div>{currency(monthlyIncome)}</div>
        </div>
        <div className="vads-u-margin-bottom--1 overview-container">
          <div>Total monthly taxes and expenses:</div>
          <div>{currency(monthlyExpenses)}</div>
        </div>
        <div className="vads-u-margin-bottom--0 overview-container">
          <div>Income after taxes and expenses:</div>
          <div>{currency(incomeMinusExpenses)}</div>
        </div>
      </div>
    </>
  );
};

FinancialOverview.propTypes = {
  formData: PropTypes.object,
};

const mapStateToProps = ({ form }) => ({
  formData: form.data,
});

export default connect(mapStateToProps)(FinancialOverview);
