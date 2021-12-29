import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Payments } from './Payments';
import DashboardWidgetWrapper from '../DashboardWidgetWrapper';
import { getAllPayments } from 'applications/disability-benefits/view-payments/actions';
import IconCTALink from '../IconCTALink';
import recordEvent from '~/platform/monitoring/record-event';
import paymentsSuccess from '../../tests/fixtures/test-payments-response.json';

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

  return (
    <div
      className="health-care-wrapper vads-u-margin-y--6"
      data-testid="dashboard-section-payment-and-debts"
    >
      <h2>Benefit payments and debts</h2>
      <div className="vads-l-row">
        {(payments || debts) && (
          <DashboardWidgetWrapper>
            {debts && <Debts debts={debts} hasError={debtsError} />}
            {payments && (
              <Payments payments={payments} hasError={paymentsError} />
            )}
          </DashboardWidgetWrapper>
        )}
        <DashboardWidgetWrapper>
          <IconCTALink
            href={'/profile/direct-deposit'}
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
  );
};

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => {
  return {
    payments: paymentsSuccess.data.attributes.payments, // state.allPayments.payments,
    paymentsError: false, // state.allPayments.error,
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
