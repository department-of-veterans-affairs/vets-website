import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const CREDIT_CARD_BILL_BALANCE_LABELS = {
  1: "First card's unpaid balance",
  2: "Second card's unpaid balance",
  3: "Third card's unpaid balance",
  4: "Fourth card's unpaid balance",
  5: "Fifth card's unpaid balance",
  6: "Sixth card's unpaid balance",
  7: "Seventh card's unpaid balance",
  8: "Eighth card's unpaid balance",
  9: "Ninth card's unpaid balance",
  10: "Tenth card's unpaid balance",
  11: "11th card's unpaid balance",
  12: "12th card's unpaid balance",
  13: "13th card's unpaid balance",
  14: "14th card's unpaid balance",
  15: "15th card's unpaid balance",
  16: "16th card's unpaid balance",
  17: "17th card's unpaid balance",
  18: "18th card's unpaid balance",
  19: "19th card's unpaid balance",
  20: "20th card's unpaid balance",
  21: "21st card's unpaid balance",
  22: "22nd card's unpaid balance",
  23: "23rd card's unpaid balance",
  24: "24th card's unpaid balance",
  25: "25th card's unpaid balance",
};

const CREDIT_CARD_BILL_MIN_PAYMENT_LABELS = {
  1: "First card's minimum payment amount",
  2: "Second card's minimum payment amount",
  3: "Third card's minimum payment amount",
  4: "Fourth card's minimum payment amount",
  5: "Fifth card's minimum payment amount",
  6: "Sixth card's minimum payment amount",
  7: "Seventh card's minimum payment amount",
  8: "Eighth card's minimum payment amount",
  9: "Ninth card's minimum payment amount",
  10: "Tenth card's minimum payment amount",
  11: "11th card's minimum payment amount",
  12: "12th card's minimum payment amount",
  13: "13th card's minimum payment amount",
  14: "14th card's minimum payment amount",
  15: "15th card's minimum payment amount",
  16: "16th card's minimum payment amount",
  17: "17th card's minimum payment amount",
  18: "18th card's minimum payment amount",
  19: "19th card's minimum payment amount",
  20: "20th card's minimum payment amount",
  21: "21st card's minimum payment amount",
  22: "22nd card's minimum payment amount",
  23: "23rd card's minimum payment amount",
  24: "24th card's minimum payment amount",
  25: "25th card's minimum payment amount",
};

const CreditCardBillsSummaryReview = ({ data, title }) => {
  const { creditCardBills = [] } = data.expenses;

  return (
    <div>
      <h4>{title}</h4>
      <dl className="review">
        {creditCardBills.map((bill, index) => {
          return (
            <>
              <div className="review-row" key={bill.amountDueMonthly + index}>
                <dt>{CREDIT_CARD_BILL_BALANCE_LABELS[index + 1]}</dt>
                <dd>{currencyFormatter(bill.unpaidBalance)}</dd>
              </div>
              <div
                className="review-row"
                key={bill.amountDueMonthly + index + 1}
              >
                <dt>{CREDIT_CARD_BILL_MIN_PAYMENT_LABELS[index + 1]}</dt>
                <dd>{currencyFormatter(bill.amountDueMonthly)}</dd>
              </div>
            </>
          );
        })}
      </dl>
    </div>
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
