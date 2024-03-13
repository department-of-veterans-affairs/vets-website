import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { APP_TYPES } from '../utils/helpers';

const OtherVADebts = ({ module, subHeading }) => {
  return (
    <>
      <h3
        className={subHeading ? 'vads-u-font-size--h4' : ''}
        data-testid="other-va-debts-head"
        id="other-va-debts"
      >
        Your other VA {`${module === APP_TYPES.DEBT ? `debt` : 'bills'}`}
      </h3>
      <p className="vads-u-font-family--sans">
        Our records show you have
        {module === APP_TYPES.DEBT && (
          <span data-testid="other-va-debt-body">
            &nbsp;VA benefit debt. You can&nbsp;
            <a href="/manage-va-debt/summary/debt-balances">
              check the details of your current debt
            </a>
            <span>
              , find out how to pay your debt, and learn how to request
              financial assistance.
            </span>
          </span>
        )}{' '}
        {module === APP_TYPES.COPAY && (
          <span data-testid="other-va-copay-body">
            a VA health care copay bill. You can&nbsp;
            <a href="/manage-va-debt/summary/copay-balances">
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
        className="vads-u-font-weight--bold"
        aria-label="View all your VA debt and bills"
        to="/manage-va-debt/summary"
        data-testid="other-va-debts-link"
      >
        View all your VA debt and bills
        <i
          className="fa fa-angle-right vads-u-margin-left--1"
          aria-hidden="true"
        />
      </Link>
    </>
  );
};

OtherVADebts.propTypes = {
  module: PropTypes.string,
  subHeading: PropTypes.bool,
};

export default OtherVADebts;
