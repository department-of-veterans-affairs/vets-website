import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const FinancialOverview = () => {
  return (
    <>
      <h4>Your financial overview</h4>
      <div className="usa-alert usa-alert-info background-color-only vads-u-margin-bottom--5">
        <div>Total income: $3,000.00</div>
        <div>Total expenses: $2,800.00</div>
        <div>Discretionary income: $200.00</div>
      </div>
    </>
  );
};

FinancialOverview.propTypes = {
  income: PropTypes.object,
};

FinancialOverview.defaultProps = {
  income: {},
};

const mapStateToProps = state => ({
  income: state.form?.data,
});

export default connect(
  mapStateToProps,
  null,
)(FinancialOverview);
