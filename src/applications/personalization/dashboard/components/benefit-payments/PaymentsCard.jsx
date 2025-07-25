import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';
import classNames from 'classnames';
import { useFeatureToggle } from '~/platform/utilities/feature-toggles';
import CTALink from '../CTALink';

export const PaymentsCard = ({ lastPayment }) => {
  const { TOGGLE_NAMES, useToggleValue } = useFeatureToggle();
  const myVaAuthExpRedesignEnabled = useToggleValue(
    TOGGLE_NAMES.myVaAuthExpRedesignEnabled,
  );
  const paymentDate = new Date(lastPayment.payCheckDt);

  const content = (
    <>
      <p
        className="vads-u-margin-top--0 vads-u-margin-bottom--1 vads-u-font-size--h3 vads-u-font-family--serif vads-u-font-weight--bold"
        data-testid="deposit-header"
        aria-describedby="paycheck-type"
      >
        +{lastPayment.payCheckAmount}
      </p>
      <p
        className="vads-u-margin-top--0 vads-u-font-size--h4 vads-u-font-family--serif vads-u-font-weight--bold"
        id="paycheck-type"
      >
        {lastPayment.payCheckType}
      </p>
      <p className="vads-u-margin-bottom--1 vads-u-margin-top--0">
        {lastPayment.paymentMethod === 'Paper Check'
          ? 'Check mailed'
          : 'Deposited'}{' '}
        on {format(paymentDate, 'MMMM d, yyyy')}
      </p>
      <CTALink
        text="Review your payment history"
        href="/va-payment-history/payments/"
        testId="payment-card-view-history-link"
        className="vads-u-font-weight--bold"
        showArrow
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Review your payment history',
            'links-list-section-header': 'Benefit payments',
          });
        }}
      />
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
        <div className="vads-u-padding--1" data-testid="payment-card">
          {content}
        </div>
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
