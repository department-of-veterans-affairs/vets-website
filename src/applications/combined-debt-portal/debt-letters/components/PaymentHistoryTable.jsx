import React from 'react';
import PropTypes from 'prop-types';
import { renderPaymentHistoryDescription } from '../const/diary-codes';
import { deductionCodes } from '../const/deduction-codes';
import { currency } from '../utils/page';

const PaymentHistoryTable = ({ currentDebt }) => {
  const { paymentHistory } = currentDebt;
  if (paymentHistory.length === 0) {
    return null;
  }
  return (
    <va-table table-title="Transaction history" uswds table-type="bordered">
      <va-table-row slot="headers">
        <span>Date</span>
        <span>Description</span>
        <span>Amount</span>
      </va-table-row>
      {paymentHistory.map((payment, index) => (
        <va-table-row key={`${payment.transactionDate}-${index}`}>
          <span className="vads-u-width--fit">{payment.transactionDate}</span>
          <span>
            <div className="vads-u-margin-top--0">
              {renderPaymentHistoryDescription(payment.transactionFiscalCode)}
            </div>
          </span>
          <span>{payment.transactionTotalAmount}</span>
        </va-table-row>
      ))}
      <va-table-row>
        {/* This is the default row that will always be displayed for initial
          debt creation */}
        <span className="vads-u-width--fit">
          {currentDebt.firstPaymentDate}
        </span>
        <span>
          <strong>
            Overpayment for{' '}
            {deductionCodes[currentDebt.deductionCode] ||
              currentDebt.benefitType}
          </strong>
        </span>
        <span>{currency.format(parseFloat(currentDebt.originalAr))}</span>
      </va-table-row>
    </va-table>
  );
};

PaymentHistoryTable.propTypes = {
  currentDebt: PropTypes.object,
};

export default PaymentHistoryTable;
