import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';

export const PaymentsV2 = ({ lastPayment }) => {
  const paymentDate = new Date(lastPayment.payCheckDt);
  return (
    <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5">
      <div
        className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5"
        data-testid="payment-card-v2"
      >
        <h3 className="vads-u-margin-top--0" data-testid="deposit-header-v2">
          +{lastPayment.payCheckAmount}
        </h3>
        <h4 className="vads-u-margin-top--0">{lastPayment.payCheckType}</h4>
        <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
          {lastPayment.paymentMethod === 'Paper Check'
            ? 'Check mailed'
            : 'Deposited'}{' '}
          on {format(paymentDate, 'MMMM d, yyyy')}
        </p>
        <CTALink
          text="View your payment history"
          href="/va-payment-history/payments/"
          testId="payment-card-view-history-link-v2"
          className="vads-u-font-weight--bold"
          showArrow
          onClick={() => {
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': 'View your payment history',
              'links-list-section-header': 'Benefit payments',
            });
          }}
        />
      </div>
    </div>
  );
};

PaymentsV2.propTypes = {
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

export default PaymentsV2;
