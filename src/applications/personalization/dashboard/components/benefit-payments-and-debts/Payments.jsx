import React from 'react';
import PropTypes from 'prop-types';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';
import moment from 'moment';

export const Payments = ({ lastPayment, hasError }) => {
  if (hasError) {
    return (
      <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5">
        <va-alert
          status="error"
          className="vads-u-margin-top--0"
          headline="We can’t access your payment information"
          content={
            <>
              <p>
                We’re sorry. Something went wrong on our end, and we can’t
                access your payments information. Please try again later or go
                to the payments tool.
              </p>
              <p>
                <CTALink
                  text="View your payment history"
                  href="/va-payment-history/payments/"
                  onClick={() =>
                    recordEvent({
                      event: 'nav-linkslist',
                      'links-list-header': 'View your payment history',
                      'links-list-section-header': 'Benefit payments and debts',
                    })
                  }
                />
              </p>
            </>
          }
        />
      </div>
    );
  }

  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5">
      <div className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5">
        <h3 className="vads-u-margin-top--0">
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
        />
      </div>
    </div>
  );
};

Payments.propTypes = {
  hasError: PropTypes.bool,
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
