import React from 'react';
import { useSelector } from 'react-redux';
import { canAccess } from '../../../common/selectors';
import { API_NAMES } from '../../../common/constants';
import DebtsAndBills from '../debts/Debts';
import BenefitPayments from './BenefitPayments';

const PaymentsAndDebts = () => {
  const shouldShowLoadingIndicator = useSelector(
    state =>
      canAccess(state)[API_NAMES.PAYMENT_HISTORY] &&
      state.allPayments.isLoading,
  );

  return (
    <div className="vads-u-margin-y--6" data-testid="dashboard-section-payment">
      <h2>Payments and debts</h2>
      {shouldShowLoadingIndicator && (
        <va-loading-indicator message="Loading benefit payments..." />
      )}
      {!shouldShowLoadingIndicator && (
        <>
          <BenefitPayments />
          <DebtsAndBills />
        </>
      )}
    </div>
  );
};

export default PaymentsAndDebts;
