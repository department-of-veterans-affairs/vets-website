import React from 'react';
import PropTypes from 'prop-types';
import { currency } from '../../combined/utils/helpers';

const AccountSummary = ({
  currentBalance,
  newCharges,
  paymentsReceived,
  previousBalance,
  statementDate,
}) => {
  return (
    <div className="vads-u-padding--0">
      <h2 data-testid="account-summary-head" id="account-summary">
        Account summary
      </h2>
      <h3
        className="vads-u-margin-bottom--0"
        data-testid="account-summary-date"
      >
        {`Current balance as of ${statementDate}`}
      </h3>
      <p className="vads-u-font-size--2xl vads-u-margin--0">
        <strong
          className="vads-u-margin--0"
          data-testid="account-summary-current"
        >
          {currency(currentBalance)}
        </strong>
      </p>
      <h3 className="vads-u-margin-top--2">Balance Activity</h3>
      <ul className="balance-activity">
        <li data-testid="account-summary-previous">
          {`Previous balance: ${currency(previousBalance)}`}
        </li>
        <li data-testid="account-summary-credits">
          {`Payments received: ${currency(Math.abs(paymentsReceived))}`}
        </li>
        <li data-testid="account-summary-new-charges">
          {`New charges: ${currency(newCharges)}`}
        </li>
      </ul>
    </div>
  );
};

AccountSummary.propTypes = {
  currentBalance: PropTypes.number,
  newCharges: PropTypes.number,
  paymentsReceived: PropTypes.number,
  previousBalance: PropTypes.number,
  statementDate: PropTypes.string,
};

export default AccountSummary;
