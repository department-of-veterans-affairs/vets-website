import React from 'react';
import PropTypes from 'prop-types';
import { format, subDays } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';
import classNames from 'classnames';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';

export const PaymentsCard = ({ lastPayment }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const myVaAuthExpRedesignEnabled = useToggleValue(
    TOGGLE_NAMES.myVaAuthExpRedesignEnabled,
  );
  const paymentDate = new Date(lastPayment.payCheckDt);

  // User has not received any payments from VA in the last 60 days
  const isRecentPayment = lastPayment && paymentDate > subDays(new Date(), 61);

  const content = (
    <>
      <h4
        className="vads-u-margin-y--0 vads-u-padding-bottom--1"
        id="paycheck-type"
      >
        {isRecentPayment ? lastPayment.payCheckType : 'No recent payments'}
      </h4>
      {isRecentPayment && (
        <>
          <p
            className="vads-u-font-size--h4 vads-u-font-weight--bold vads-u-font-family--serif vads-u-margin-y--0 vads-u-margin-top--0p5 dd-privacy-mask"
            data-testid="deposit-header"
            aria-describedby="paycheck-type"
          >
            {lastPayment.payCheckAmount}
          </p>
          <p className="vads-u-margin-y--0 vads-u-margin-top--0p5">
            {lastPayment.paymentMethod === 'Paper Check'
              ? 'Check mailed'
              : 'Deposited'}{' '}
            on {format(paymentDate, 'MMMM d, yyyy')}
          </p>
        </>
      )}
      <p className="vads-u-margin-y--0 vads-u-margin-top--0p5 vads-u-padding-y--1">
        <va-link
          active
          text="Review payment history"
          href="/va-payment-history/payments/"
          data-testid="payment-card-view-history-link"
          onClick={() => {
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': 'Review your payment history',
              'links-list-section-header': 'Benefit payments',
            });
          }}
        />
      </p>
    </>
  );

  const wrapperClasses = classNames(
    'vads-u-display--flex vads-u-flex-direction--column desktop-lg:vads-u-flex--1',
    {
      'vads-u-margin-bottom--3': !myVaAuthExpRedesignEnabled,
    },
  );

  return (
    <div className={wrapperClasses}>
      <va-card>
        <div data-testid="payment-card">{content}</div>
      </va-card>
    </div>
  );
};

PaymentsCard.propTypes = {
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

export default PaymentsCard;
