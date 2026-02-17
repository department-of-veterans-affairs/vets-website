import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { subDays } from 'date-fns';
import recordEvent from '~/platform/monitoring/record-event';
import {
  useFeatureToggle,
  Toggler,
} from '~/platform/utilities/feature-toggles';
import PaymentsCardLegacy from './PaymentsCardLegacy';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import { canAccess } from '../../../common/selectors';
import { API_NAMES } from '../../../common/constants';

const NoRecentPaymentText = () => {
  return (
    <p
      className="vads-u-margin-bottom--3 vads-u-margin-top--0"
      data-testid="no-recent-payments-text"
    >
      You have no recent payments to show.
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
        <h2 slot="headline">We can’t access your payment history</h2>
        <div>
          We’re sorry. We can’t access your payment history right now. We’re
          working to fix this problem. Please check back later.
        </div>
      </va-alert>
    </div>
  );
};

const BenefitPaymentsLegacy = ({
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
      data-testid="dashboard-section-payment"
    >
      <h2>Benefit payments</h2>
      <div className="vads-l-row">
        {lastPayment && (
          <>
            <DashboardWidgetWrapper>
              <PaymentsCardLegacy lastPayment={lastPayment} />
            </DashboardWidgetWrapper>
            <Toggler
              toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
            >
              <Toggler.Disabled>
                <DashboardWidgetWrapper>
                  <PopularActionsForPayments />
                </DashboardWidgetWrapper>
              </Toggler.Disabled>
            </Toggler>
          </>
        )}
        {!lastPayment && (
          <DashboardWidgetWrapper>
            {paymentsError ? <PaymentsError /> : <NoRecentPaymentText />}
            <Toggler
              toggleName={Toggler.TOGGLE_NAMES.myVaAuthExpRedesignEnabled}
            >
              <Toggler.Disabled>
                <PopularActionsForPayments
                  showPaymentHistoryLink={
                    (payments && !!payments.length) || paymentsError
                  }
                />
              </Toggler.Disabled>
            </Toggler>
          </DashboardWidgetWrapper>
        )}
      </div>
    </div>
  );
};

BenefitPaymentsLegacy.propTypes = {
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

export default connect(mapStateToProps, {})(BenefitPaymentsLegacy);
