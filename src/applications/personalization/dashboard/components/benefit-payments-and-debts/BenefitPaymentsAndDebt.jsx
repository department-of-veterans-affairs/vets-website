import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Payments } from './Payments';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import recordEvent from '~/platform/monitoring/record-event';
import { fetchDebts } from '~/applications/personalization/dashboard/actions/debts';
import Debts from './Debts';

const NoRecentPaymentText = () => {
  return (
    <p
      className="vads-u-margin-bottom--3 vads-u-margin-top--0"
      data-testid="no-recent-payments-paragraph"
    >
      You haven’t received any payments in the past 30 days.
    </p>
  );
};

const BenefitPaymentsAndDebt = ({
  debts,
  debtsError,
  getDebts,
  payments,
  shouldShowLoadingIndicator,
}) => {
  useEffect(
    () => {
      getDebts();
    },
    [getDebts],
  );

  const lastPayment =
    payments
      ?.filter(p => moment(p.payCheckDt) > moment().subtract(31, 'days'))
      .sort((a, b) => moment(b.payCheckDt) - moment(a.payCheckDt))[0] ?? null;

  const debtsCount = debts?.length || 0;

  if (shouldShowLoadingIndicator) {
    return (
      <div className="vads-u-margin-y--6">
        <h2 className="vads-u-margin-top--0 vads-u-margin-bottom--2">
          Benefit payments and debts
        </h2>
        <va-loading-indicator message="Loading benefit payments and debts..." />
      </div>
    );
  }

  return (
    payments &&
    !!payments.length && (
      <div
        className="health-care-wrapper vads-u-margin-y--6"
        data-testid="dashboard-section-payment-and-debts"
      >
        <h2>Benefit payments and debts</h2>
        <div className="vads-l-row">
          {((debtsCount === 0 && lastPayment) ||
            debtsCount > 0 ||
            debtsError) && (
            <DashboardWidgetWrapper>
              <Debts debts={debts} hasError={debtsError} />
              {lastPayment && <Payments lastPayment={lastPayment} />}
              {!lastPayment && <NoRecentPaymentText />}
            </DashboardWidgetWrapper>
          )}
          <DashboardWidgetWrapper>
            {!lastPayment &&
              debtsCount < 1 &&
              !debtsError && (
                <>
                  <Debts debts={debts} hasError={debtsError} />
                  <NoRecentPaymentText />
                </>
              )}
            <h3 className="sr-only">
              Popular actions for Benefit Payments and Debt
            </h3>
            {!lastPayment && (
              <IconCTALink
                href="/va-payment-history/payments/"
                icon="user-check"
                text="View your payment history"
                /* eslint-disable react/jsx-no-bind */
                onClick={() => {
                  recordEvent({
                    event: 'nav-linkslist',
                    'links-list-header': 'View your payment history',
                    'links-list-section-header': 'Benefit payments and debts',
                  });
                }}
                /* eslint-enable react/jsx-no-bind */
                testId="view-payment-history-link"
              />
            )}

            <IconCTALink
              href="/profile/direct-deposit"
              icon="dollar-sign"
              text="Manage your direct deposit"
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
            {debtsCount < 1 && (
              <IconCTALink
                href="/resources/va-debt-management"
                icon="file-invoice-dollar"
                text="Learn about VA debt"
                /* eslint-disable react/jsx-no-bind */
                onClick={() => {
                  recordEvent({
                    event: 'nav-linkslist',
                    'links-list-header': 'Learn about VA debt',
                    'links-list-section-header': 'Learn about VA debt',
                  });
                }}
                /* eslint-enable react/jsx-no-bind */
                testId="learn-va-debt-link"
              />
            )}
          </DashboardWidgetWrapper>
        </div>
      </div>
    )
  );
};

BenefitPaymentsAndDebt.propTypes = {
  debts: PropTypes.arrayOf(
    PropTypes.shape({
      fileNumber: PropTypes.string.isRequired,
      payeeNumber: PropTypes.string.isRequired,
      personEntitled: PropTypes.string.isRequired,
      deductionCode: PropTypes.string.isRequired,
      benefitType: PropTypes.string.isRequired,
      diaryCode: PropTypes.string.isRequired,
      diaryCodeDescription: PropTypes.string,
      amountOverpaid: PropTypes.number.isRequired,
      amountWithheld: PropTypes.number.isRequired,
      originalAr: PropTypes.number.isRequired,
      currentAr: PropTypes.number.isRequired,
      debtHistory: PropTypes.arrayOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          letterCode: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
        }),
      ),
    }),
  ),
  debtsError: PropTypes.bool,
  getDebts: PropTypes.func,
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
  shouldShowLoadingIndicator: PropTypes.bool,
};

const mapStateToProps = state => {
  const debtsIsLoading = state.allDebts.isLoading;
  const paymentsIsLoading = state.allPayments.isLoading;
  const debts = state.allDebts.debts || [];
  return {
    debts,
    debtsError: state.allDebts.isError || false,
    shouldShowLoadingIndicator: debtsIsLoading || paymentsIsLoading,
  };
};

const mapDispatchToProps = {
  getDebts: fetchDebts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitPaymentsAndDebt);
