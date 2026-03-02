import React from 'react';
import PropTypes from 'prop-types';
import { currency } from '../../combined/utils/helpers';

export const AccountSummary = ({
  acctNum,
  paymentsReceived,
  previousBalance,
}) => {
  return (
    <section>
      <h2
        data-testid="account-summary-head"
        id="account-summary"
        className="vads-u-margin-top--2"
      >
        Account summary
      </h2>
      <h3 className="vads-u-margin-top--2">Copay details</h3>
      <ul className="no-bullets vads-u-padding-x--0">
        <li
          data-testid="account-summary-previous"
          className="vads-u-margin-bottom--0p5"
        >
          {`Previous balance: ${currency(previousBalance)}`}
        </li>
        <li
          data-testid="account-summary-credits"
          className="vads-u-margin-bottom--0p5"
        >
          {`Payments received: ${currency(Math.abs(paymentsReceived))}`}
        </li>
      </ul>
      <h3 className="vads-u-margin-top--2">Account number</h3>
      <p>{acctNum}</p>
    </section>
  );
};

AccountSummary.propTypes = {
  acctNum: PropTypes.string,
  paymentsReceived: PropTypes.number,
  previousBalance: PropTypes.number,
};

export default AccountSummary;
