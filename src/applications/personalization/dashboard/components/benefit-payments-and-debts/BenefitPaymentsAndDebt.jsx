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

  return (
    payments && (
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
                <p className="vads-u-margin-bottom--3 vads-u-margin-top--0">
                  You haven’t received any payments in the past 30 days.
                </p>
                <IconCTALink
                  href="/va-payment-history/payments/"
                  icon="user-check"
                  newTab
                  text="View your payment history"
                  onClick={() => {
                    recordEvent({
                      event: 'nav-linkslist',
                      'links-list-header': 'View your payment history',
                      'links-list-section-header': 'Benefit payments and debts',
                    });
                  }}
                />
              </>
            )}
            <IconCTALink
              href="/profile/direct-deposit"
              icon="dollar-sign"
              newTab
              text="Manage your direct deposit"
              onClick={() => {
                recordEvent({
                  event: 'nav-linkslist',
                  'links-list-header': 'Manage your direct deposit',
                  'links-list-section-header': 'Direct deposit',
                });
              }}
            />
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
  paymentsError: PropTypes.bool,
  debtsError: PropTypes.bool,
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BenefitPaymentsAndDebt);
