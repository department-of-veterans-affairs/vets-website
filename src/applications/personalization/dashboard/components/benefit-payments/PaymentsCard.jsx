import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import CTALink from '../CTALink';
import recordEvent from '~/platform/monitoring/record-event';
import { Toggler } from '~/platform/utilities/feature-toggles';

export const PaymentsCard = ({ lastPayment }) => {
  const paymentDate = new Date(lastPayment.payCheckDt);

  const content = (
    <>
      <h3
        className="vads-u-margin-top--0"
        data-testid="deposit-header"
        aria-describedby="paycheck-type"
      >
        +{lastPayment.payCheckAmount}
      </h3>
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

  return (
    <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaUseExperimentalFrontend}>
      <Toggler.Enabled>
        <div className="vads-u-margin-bottom--3 vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1">
          <va-card>
            <div className="vads-u-padding--1" data-testid="payment-card">
              {content}
            </div>
          </va-card>
        </div>
      </Toggler.Enabled>

      <Toggler.Disabled>
        <div className="vads-u-display--flex vads-u-flex-direction--column large-screen:vads-u-flex--1 vads-u-margin-bottom--2p5">
          <div
            className="vads-u-background-color--gray-lightest vads-u-padding-y--2p5 vads-u-padding-x--2p5"
            data-testid="payment-card"
          >
            {content}
          </div>
        </div>
      </Toggler.Disabled>
    </Toggler>
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
