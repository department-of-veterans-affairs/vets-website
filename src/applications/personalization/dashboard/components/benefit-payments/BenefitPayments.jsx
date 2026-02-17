import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import recordEvent from '~/platform/monitoring/record-event';
import {
  Toggler,
  useFeatureToggle,
} from '~/platform/utilities/feature-toggles';
import PaymentsCard from './PaymentsCard';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';

const NoRecentPaymentText = () => {
  return (
    <p
      className="vads-u-margin-top--0 vads-u-margin-bottom--1"
      data-testid="no-recent-payments-text"
    >
      You don’t have any recent payments.
    </p>
  );
};

const PopularActionsForPayments = ({ showPaymentHistoryLink = false }) => {
  return (
    <>
      {/* todo check for direct deposit first */}
      <IconCTALink
        href="/profile/direct-deposit"
        icon="attach_money"
        text="Manage your direct deposit information"
        /* eslint-disable react/jsx-no-bind */
        onClick={() => {
          recordEvent({
            event: 'nav-linkslist',
            'links-list-header': 'Manage your direct deposit',
            'links-list-section-header': 'Direct deposit',
          });
        }}
        /* eslint-enable react/jsx-no-bind */
        testId="manage-direct-deposit-link"
      />
      {showPaymentHistoryLink && (
        <IconCTALink
          href="/va-payment-history/payments/"
          icon="how_to_reg"
          text="Review your payment history"
          /* eslint-disable react/jsx-no-bind */
          onClick={() => {
            recordEvent({
              event: 'nav-linkslist',
              'links-list-header': 'Review your payment history',
              'links-list-section-header': 'Benefit payments',
            });
          }}
          /* eslint-enable react/jsx-no-bind */
          testId="view-payment-history-link"
        />
      )}
    </>
  );
};

PopularActionsForPayments.propTypes = {
  showPaymentHistoryLink: PropTypes.bool,
};

const PaymentsError = () => {
  const { useToggleValue, TOGGLE_NAMES } = useFeatureToggle();

  // status will be 'warning' if toggle is on
  const status = useToggleValue(TOGGLE_NAMES.myVaUpdateErrorsWarnings)
    ? 'warning'
    : 'error';

  return (
    <div className="vads-u-margin-bottom--2p5">
      <va-alert status={status} show-icon data-testid="payments-error">
        <div>
          We can’t show your benefit payments history right now. Refresh this
          page or try again later.
        </div>
      </va-alert>
    </div>
  );
};

const BenefitPayments = () => {
  const lastPayment = useSelector(
    state =>
      state.allPayments.payments?.sort(
        (a, b) => new Date(b.payCheckDt) - new Date(a.payCheckDt),
      )[0] ?? null,
  );
  const paymentsError = useSelector(
    state => !!state.allPayments.error || false,
  );

  return (
    <>
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}>
        <Toggler.Enabled>
          <h3 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
            Benefit payments
          </h3>
        </Toggler.Enabled>
      </Toggler>
      <div className="vads-l-row">
        {lastPayment && (
          <>
            <DashboardWidgetWrapper>
              <PaymentsCard lastPayment={lastPayment} />
            </DashboardWidgetWrapper>
          </>
        )}
        {!lastPayment && (
          <DashboardWidgetWrapper>
            {paymentsError ? <PaymentsError /> : <NoRecentPaymentText />}
            <va-link
              href="/va-payment-history/payments/"
              text="View all payment information"
              data-testid="view-payment-history-link"
            />
          </DashboardWidgetWrapper>
        )}
      </div>
    </>
  );
};

export default BenefitPayments;
