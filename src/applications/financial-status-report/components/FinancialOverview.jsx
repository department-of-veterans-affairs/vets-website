import React from 'react';
import { connect } from 'react-redux';

const FinancialOverview = ({ formData: { fsrDebts } }) => {
  const index = window.location.href.slice(-1);
  const debt = fsrDebts[index];
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <>
      <h4>Your financial overview</h4>
      <div className="usa-alert usa-alert-info background-color-only vads-u-margin-bottom--5">
        <div className="vads-u-margin-bottom--1">
          Total monthly income:{' '}
          {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
        </div>
        <div className="vads-u-margin-bottom--1">
          Total monthly expenses:{' '}
          {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
        </div>
        <div className="vads-u-margin-bottom--1">
          Monthly discretionary income:{' '}
          {debt.currentAr && formatter.format(parseFloat(debt.currentAr))}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  formData: state?.form?.data,
});

export default connect(mapStateToProps)(FinancialOverview);
