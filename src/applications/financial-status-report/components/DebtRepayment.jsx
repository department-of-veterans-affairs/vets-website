import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const DebtRepayment = () => {
  return (
    <>
      <h4>Debt repayment options (1 of 3)</h4>
      <div className="usa-alert background-color-only vads-u-margin-bottom--5">
        <div className="vads-u-margin-bottom--2">
          <h4 className="vads-u-margin--0">
            Post-9/11 GI Bill debt for tuition and fees
          </h4>
          <span>Updated on July 12, 2020</span>
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Amount owed: </strong>
          $9,525.00
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Status: </strong>
          First debt notification sent
        </div>
        <div className="vads-u-margin-bottom--1">
          <strong>Date of first notice: </strong>
          July 12, 2020
        </div>
      </div>
    </>
  );
};

DebtRepayment.propTypes = {
  expenses: PropTypes.object,
};

DebtRepayment.defaultProps = {
  expenses: {},
};

const mapStateToProps = state => ({
  expenses: state.form?.data,
});

export default connect(
  mapStateToProps,
  null,
)(DebtRepayment);
