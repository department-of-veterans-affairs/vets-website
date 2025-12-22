import React from 'react';
import PropTypes from 'prop-types';
import { APP_TYPES } from '../utils/helpers';

const OtherVADebts = ({ module, subHeading }) => {
  const HeadingTag = subHeading ? 'h3' : 'h2';
  return (
    <>
      <HeadingTag
        className={subHeading ? 'vads-u-font-size--h4' : 'vads-u-font-size--h2'}
        data-testid="other-va-debts-head"
        id="other-va-debts"
      >
        {`${
          module === APP_TYPES.DEBT ? `Overpayment balances` : 'VA copay bills'
        }`}
      </HeadingTag>
      <p>
        Our records show you have{' '}
        {module === APP_TYPES.DEBT && (
          <span data-testid="other-va-debt-body">VA benefit overpayments.</span>
        )}{' '}
        {module === APP_TYPES.COPAY && (
          <span data-testid="other-va-copay-body">
            VA health care copay bills.
          </span>
        )}{' '}
        You can check the details of your balance, find out how to make a
        payment, and learn how to request financial assistance.
      </p>
      {module === APP_TYPES.DEBT && (
        <va-link
          href="/manage-va-debt/summary/debt-balances"
          data-testid="other-va-debts-link"
          active
          text="Review overpayment balances"
          class="vads-u-margin-top--2"
        />
      )}
      {module === APP_TYPES.COPAY && (
        <va-link
          href="/manage-va-debt/summary/copay-balances"
          data-testid="other-va-debts-link"
          active
          text="Review copay bills"
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
