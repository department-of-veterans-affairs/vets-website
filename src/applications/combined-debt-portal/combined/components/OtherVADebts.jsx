import React from 'react';
import PropTypes from 'prop-types';
import { APP_TYPES } from '../utils/helpers';

const OtherVADebts = ({ module, subHeading }) => {
  return (
    <>
      <h2
        className={subHeading ? 'vads-u-font-size--h3' : ''}
        data-testid="other-va-debts-head"
        id="other-va-debts"
      >
        Your VA {`${module === APP_TYPES.DEBT ? `debt` : 'copay bills'}`}
      </h2>
      <p>
        Our records show you have{' '}
        {module === APP_TYPES.DEBT && (
          <span data-testid="other-va-debt-body">
            VA benefit debt. You can check the details of your current debt,
            find out how to pay your debt, and learn how to request financial
            assistance.
          </span>
        )}{' '}
        {module === APP_TYPES.COPAY && (
          <span data-testid="other-va-copay-body">
            VA health care copay bills. You can check the details of your copay
            balance, find out how to pay your balance, and learn how to request
            financial assistance.
          </span>
        )}
      </p>
      {module === APP_TYPES.DEBT && (
        <va-link
          href="/manage-va-debt/summary/debt-balances"
          data-testid="other-va-debts-link"
          active
          text="Review your VA debt"
          class="vads-u-margin-top--2"
        />
      )}
      {module === APP_TYPES.COPAY && (
        <va-link
          href="/manage-va-debt/summary/copay-balances"
          data-testid="other-va-debts-link"
          active
          text="Review your VA copay bills"
          class="vads-u-margin-top--2"
        />
      )}
    </>
  );
};

OtherVADebts.propTypes = {
  module: PropTypes.string,
  subHeading: PropTypes.bool,
};

export default OtherVADebts;
