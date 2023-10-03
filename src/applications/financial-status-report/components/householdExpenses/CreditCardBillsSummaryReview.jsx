import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const renderUnpaidBalance = (bill, index) => {
  return (
    <div className="review-row" key={bill.amountDueMonthly + index}>
      <dt>Unpaid balance</dt>
      <dd>{currencyFormatter(bill.unpaidBalance)}</dd>
    </div>
  );
};

const renderAmountOverdue = (bill, index) => {
  if (bill.amountPastDue === '0') return null;

  return (
    <div className="review-row" key={bill.amountDueMonthly + index + 1}>
      <dt>Amount overdue</dt>
      <dd>{currencyFormatter(bill.amountPastDue)}</dd>
    </div>
  );
};

const renderMinMonthlyPayment = (bill, index) => {
  return (
    <div className="review-row" key={bill.amountDueMonthly + index + 2}>
      <dt>Minimum monthly payment</dt>
      <dd>{currencyFormatter(bill.amountDueMonthly)}</dd>
    </div>
  );
};

const CreditCardBillsSummaryReview = ({ data }) => {
  const { creditCardBills = [] } = data.expenses;

  return (
    <>
      {creditCardBills.map((bill, index) => {
        return (
          <div
            className="form-review-panel-page"
            key={index + bill.amountDueMonthly}
          >
            <div className="form-review-panel-page-header-row">
              <h4 className="form-review-panel-page-header vads-u-font-size--h5">
                Credit card bill {index + 1}
              </h4>
            </div>
            <dl className="review">
              {renderUnpaidBalance(bill, index)}
              {bill?.amountPastDue > 0
                ? renderAmountOverdue(bill, index)
                : null}
              {renderMinMonthlyPayment(bill, index)}
            </dl>
          </div>
        );
      })}
    </>
  );
};

CreditCardBillsSummaryReview.propTypes = {
  data: PropTypes.shape({
    expenses: PropTypes.shape({
      creditCardBills: PropTypes.array,
    }),
  }),
  title: PropTypes.string,
};

export default CreditCardBillsSummaryReview;
