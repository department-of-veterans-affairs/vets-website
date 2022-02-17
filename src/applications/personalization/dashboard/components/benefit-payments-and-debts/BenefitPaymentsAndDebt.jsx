import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllPayments } from 'applications/disability-benefits/view-payments/actions';
import moment from 'moment';
import { Payments } from './Payments';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import IconCTALink from '../IconCTALink';
import recordEvent from '~/platform/monitoring/record-event';

import Debts from './Debts';

const BenefitPaymentsAndDebt = ({
  payments,
  debts,
  debtsError,
  paymentsError,
  getPayments,
}) => {
  useEffect(
    () => {
      getPayments();
    },
    [getPayments],
  );
  const lastPayment = payments
    ?.filter(p => moment(p.payCheckDt) > moment().subtract(31, 'days'))
    .sort((a, b) => moment(b.payCheckDt) - moment(a.payCheckDt))[0];

  const debtsCount = debts?.length || 0;

  return (
    payments &&
    !!payments.length && (
      <div
        className="health-care-wrapper vads-u-margin-y--6"
        data-testid="dashboard-section-payment-and-debts"
      >
        <h2>Benefit payments and debts</h2>
        <div className="vads-l-row">
          {lastPayment &&
            (payments || debts) && (
              <DashboardWidgetWrapper>
                {debts && <Debts debts={debts} hasError={debtsError} />}
                {payments && (
                  <Payments
                    lastPayment={lastPayment}
                    hasError={paymentsError}
                  />
                )}
              </DashboardWidgetWrapper>
            )}
          <DashboardWidgetWrapper>
            {!lastPayment && (
              <>
                {debts && <Debts debts={debts} hasError={debtsError} />}
                <p
                  className="vads-u-margin-bottom--3 vads-u-margin-top--0"
                  data-testid="no-recent-payments-paragraph"
                >
                  You haven’t received any payments in the past 30 days.
                </p>
              </>
            )}
            <h3 className="sr-only">
              Popular actions for Benefit Payments and Debt
            </h3>
            {!lastPayment && (
              <IconCTALink
                href="/va-payment-history/payments/"
                icon="user-check"
                newTab
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
              newTab
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
                newTab
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

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => {
  return {
    payments: state.allPayments.payments?.payments || [],
    paymentsError: state.allPayments.error,
  };
};

const mapDispatchToProps = {
  // todo: not being used yet as this is a mockup
  getPayments: getAllPayments,
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
  getPayments: PropTypes.func,
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitPaymentsAndDebt);
