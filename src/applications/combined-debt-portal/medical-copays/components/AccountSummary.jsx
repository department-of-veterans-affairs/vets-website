import React from 'react';
import PropTypes from 'prop-types';
import { currency } from '../../combined/utils/helpers';

export const AccountSummary = ({
  acctNum,
  currentBalance,
  newCharges,
  paymentsReceived,
  previousBalance,
  showOneThingPerPage = false,
  statementDate,
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
      {showOneThingPerPage ? null : (
        <>
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
        </>
      )}
      {showOneThingPerPage ? (
        <h3 className="vads-u-margin-top--2">Copay details</h3>
      ) : (
        <h3 className="vads-u-margin-top--2">Balance activity</h3>
      )}
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
        {showOneThingPerPage ? null : (
          <li
            data-testid="account-summary-new-charges"
            className="vads-u-margin-bottom--0"
          >
            {`New charges: ${currency(newCharges)}`}
          </li>
        )}
      </ul>
      <h3 className="vads-u-margin-top--2">Account number</h3>
      <p>{acctNum}</p>
    </section>
  );
};

AccountSummary.propTypes = {
  acctNum: PropTypes.string,
  currentBalance: PropTypes.number,
  newCharges: PropTypes.number,
  paymentsReceived: PropTypes.number,
  previousBalance: PropTypes.number,
  showOneThingPerPage: PropTypes.bool,
  statementDate: PropTypes.string,
};

export default AccountSummary;
