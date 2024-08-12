import React from 'react';
import { deductionCodes } from '../const/deduction-codes';
import { currency } from '../utils/page';

const PaymentHistoryTable = ({ currentDebt }) => {
  const getPaymentHistoryDescription = transactionDescription => {
    if (
      transactionDescription.startsWith('Increase to AR') ||
      transactionDescription.startsWith('Increase to New AR')
    ) {
      return 'Balance increase';
    }
    if (transactionDescription.startsWith('AR Decrease')) {
      return 'Balance decrease';
    }
    if (transactionDescription.includes('Write Off')) {
      return 'Write Off';
    }
    if (
      transactionDescription.includes('Reversal') ||
      transactionDescription.includes('TOP Reversal')
    ) {
      return 'Reversal';
    }
    return 'Other';
  };

  const renderPaymentHistoryDescription = transactionDescription => {
    return (
      <>
        <p className="vads-u-margin--0 vads-u-font-size-md">
          <strong>
            {getPaymentHistoryDescription(transactionDescription)}
          </strong>
        </p>
      </>
    );
  };

  const { fiscalTransactionData } = currentDebt;
  if (fiscalTransactionData.length === 0) {
    return null;
  }
  return (
    <va-table table-title="Transaction history" uswds table-type="bordered">
      <va-table-row slot="headers">
        <span>Date</span>
        <span>Description</span>
        <span>Amount</span>
      </va-table-row>
      {fiscalTransactionData.map((payment, index) => (
        <va-table-row key={`${payment.transactionDate}-${index}`}>
          <span className="vads-u-width--fit">{payment.transactionDate}</span>
          <span>
            <div className="vads-u-margin-top--0">
              {renderPaymentHistoryDescription(payment.transactionDescription)}
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

export default PaymentHistoryTable;
