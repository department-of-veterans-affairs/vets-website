import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const OtherVADebts = ({ module }) => {
  return (
    <>
      <h2 data-testid="other-va-debts-head" id="other-va-debts">
        Your other VA {module === 'MCP' ? 'debt' : 'bills'}
      </h2>
      <p>
        Our records show you have&nbsp;
        {module === 'MCP' ? (
          <span>
            VA benefit debt. You can&nbsp;
            <a href="/manage-va-debt/your-debt">
              check the details of your current debt
            </a>
            <span>
              , find out how to pay your debt, and learn how to request
              financial assistance.
            </span>
          </span>
        ) : (
          <span>
            a VA health care copay bill. You can&nbsp;
            <a href="/health-care/pay-copay-bill/your-current-balances">
              check the details of your copay balance
            </a>
            <span>
              , find out how to pay your balance, and learn how to request
              financial assistance.
            </span>
          </span>
        )}
      </p>
      <Link
        className="vads-u-font-size--sm vads-u-font-weight--bold"
        aria-label="View all your VA debt and bills"
        to="/debt-and-bills"
        data-testid="other-va-debts-link"
      >
        <span>View all your VA debt and bills</span>
        <i
          className="fa fa-chevron-right vads-u-margin-left--1"
          aria-hidden="true"
        />
      </Link>
    </>
  );
};

OtherVADebts.propTypes = {
  module: PropTypes.object,
};

export default OtherVADebts;
