import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CTALink from '../CTALink';

export const Payments = ({ lastPayment }) => {
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5">
      <div
        className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5"
        data-testid="payment-card"
      >
        <h3 className="vads-u-margin-top--0" data-testid="deposit-header">
          We deposited {lastPayment.payCheckAmount} in your account ending in{' '}
          {lastPayment.accountNumber.substr(-4)} on{' '}
          {moment(lastPayment.payCheckDt).format('MMMM D, YYYY')}
        </h3>
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          Type: {lastPayment.payCheckType}
        </p>
        <CTALink
          text="View your payment history"
          href="/va-payment-history/payments/"
          testId="payment-card-view-history-link"
        />
      </div>
    </div>
  );
};

Payments.propTypes = {
  lastPayment: PropTypes.shape({
    payCheckAmount: PropTypes.string.isRequired,
    payCheckDt: PropTypes.string.isRequired,
    payCheckId: PropTypes.string.isRequired,
    payCheckReturnFiche: PropTypes.string.isRequired,
    payCheckType: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    bankName: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired,
  }),
};

export default Payments;
