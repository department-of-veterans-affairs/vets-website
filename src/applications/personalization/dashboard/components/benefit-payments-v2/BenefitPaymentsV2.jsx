import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { subDays } from 'date-fns';
import PaymentsCardV2 from './PaymentsCardV2';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import recordEvent from '~/platform/monitoring/record-event';
import { Toggler } from '~/platform/utilities/feature-toggles/Toggler';
import { canAccess } from '../../../common/selectors';
import { API_NAMES } from '../../../common/constants';

const NoRecentPaymentText = () => {
  return (
    <p
      className="vads-u-margin-bottom--3 vads-u-margin-top--0"
      data-testid="no-recent-payments-paragraph-v2"
    >
      You have no recent payments to show.
    </p>
  );
};

const PopularActionsForPayments = ({ showPaymentHistoryLink = false }) => {
  return (
    <>
      <h3 className="sr-only">Popular actions for Benefit Payments</h3>
      {/* todo check for direct deposit first */}
      <IconCTALink
        href="/profile/direct-deposit"
        icon="dollar-sign"
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
        testId="manage-direct-deposit-link-v2"
      />
      {showPaymentHistoryLink && (
        <IconCTALink
          href="/va-payment-history/payments/"
          icon="user-check"
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
          testId="view-payment-history-link-v2"
        />
      )}
    </>
  );
};

PopularActionsForPayments.propTypes = {
  showPaymentHistoryLink: PropTypes.bool,
};

const PaymentsError = () => {
  return (
    <div className="vads-u-margin-bottom--2p5">
      <Toggler toggleName={Toggler.TOGGLE_NAMES.myVaUpdateErrorsWarnings}>
        <Toggler.Enabled>
          <va-alert status="warning" show-icon data-testid="payments-v2-error">
            <h2 slot="headline">We can’t access your payment history</h2>
            <div>
              We’re sorry. We can’t access your payment history right now. We’re
              working to fix this problem. Please check back later.
            </div>
          </va-alert>
        </Toggler.Enabled>

        <Toggler.Disabled>
          <va-alert status="error" show-icon data-testid="payments-v2-error">
            <h2 slot="headline">We can’t access your payment history</h2>
            <div>
              We’re sorry. We can’t access your payment history right now. We’re
              working to fix this problem. Please check back later.
            </div>
          </va-alert>
        </Toggler.Disabled>
      </Toggler>
    </div>
  );
};

const BenefitPaymentsV2 = ({
  payments,
  paymentsError,
  shouldShowLoadingIndicator,
}) => {
  const lastPayment =
    payments
      ?.filter(p => new Date(p.payCheckDt) > subDays(new Date(), 61))
      .sort((a, b) => new Date(b.payCheckDt) - new Date(a.payCheckDt))[0] ??
    null;

  if (shouldShowLoadingIndicator) {
    return (
      <div className="vads-u-margin-y--6">
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Benefit payments
        </h2>
        <va-loading-indicator message="Loading benefit payments..." />
      </div>
    );
  }

  return (
    <div
      className="health-care-wrapper vads-u-margin-y--6"
      data-testid="dashboard-section-payment-v2"
    >
      <h2>Benefit payments</h2>
      <div className="vads-l-row">
        {lastPayment && (
          <>
            <DashboardWidgetWrapper>
              <PaymentsCardV2 lastPayment={lastPayment} />
            </DashboardWidgetWrapper>
            <DashboardWidgetWrapper>
              <PopularActionsForPayments />
            </DashboardWidgetWrapper>
          </>
        )}
        {!lastPayment && (
          <DashboardWidgetWrapper>
            {paymentsError ? <PaymentsError /> : <NoRecentPaymentText />}
            <PopularActionsForPayments
              showPaymentHistoryLink={
                (payments && !!payments.length) || paymentsError
              }
            />
          </DashboardWidgetWrapper>
        )}
      </div>
    </div>
  );
};

BenefitPaymentsV2.propTypes = {
  payments: PropTypes.arrayOf(
    PropTypes.shape({
      payCheckAmount: PropTypes.string.isRequired,
      payCheckDt: PropTypes.string.isRequired,
      payCheckId: PropTypes.string.isRequired,
      payCheckReturnFiche: PropTypes.string.isRequired,
      payCheckType: PropTypes.string.isRequired,
      paymentMethod: PropTypes.string.isRequired,
      bankName: PropTypes.string.isRequired,
      accountNumber: PropTypes.string.isRequired,
    }),
  ),
  paymentsError: PropTypes.bool,
  shouldShowLoadingIndicator: PropTypes.bool,
};

const mapStateToProps = state => {
  const canAccessPaymentHistory = canAccess(state)[API_NAMES.PAYMENT_HISTORY];
  return {
    payments: state.allPayments.payments || [],
    paymentsError: !!state.allPayments.error || false,
    shouldShowLoadingIndicator: canAccessPaymentHistory
      ? state.allPayments.isLoading
      : false,
  };
};

export default connect(
  mapStateToProps,
  {},
)(BenefitPaymentsV2);
