import React from 'react';
import PropTypes from 'prop-types';
import { APP_TYPES } from '../utils/helpers';

const OtherVADebts = ({ module, subHeading }) => {
  return (
    <>
      <h3
        className={subHeading ? 'vads-u-font-size--h4' : ''}
        data-testid="other-va-debts-head"
        id="other-va-debts"
      >
        Your VA {`${module === APP_TYPES.DEBT ? `debt` : 'copay bills'}`}
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

      <va-link
        href="/manage-va-debt/summary/"
        data-testid="other-va-debts-link"
        active
        text="View all your VA debt and bills"
        class="vads-u-margin-top--2"
      />
    </>
  );
};

OtherVADebts.propTypes = {
  module: PropTypes.string,
  subHeading: PropTypes.bool,
};

export default OtherVADebts;
