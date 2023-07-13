import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const CREDIT_CARD_BILL_BALANCE_LABELS = {
  1: 'First card unpaid balance',
  2: 'Second card unpaid balance',
  3: 'Third card unpaid balance',
  4: 'Fourth card unpaid balance',
  5: 'Fifth card unpaid balance',
  6: 'Sixth card unpaid balance',
  7: 'Seventh card unpaid balance',
  8: 'Eighth card unpaid balance',
  9: 'Ninth card unpaid balance',
  10: 'Tenth card unpaid balance',
  11: '11th card unpaid balance',
  12: '12th card unpaid balance',
  13: '13th card unpaid balance',
  14: '14th card unpaid balance',
  15: '15th card unpaid balance',
  16: '16th card unpaid balance',
  18: '18th card unpaid balance',
  17: '17th card unpaid balance',
  19: '19th card unpaid balance',
  20: '20th card unpaid balance',
  21: '21st card unpaid balance',
  22: '22nd card unpaid balance',
  23: '23rd card unpaid balance',
  24: '24th card unpaid balance',
  25: '25th card unpaid balance',
};

const CREDIT_CARD_BILL_MIN_PAYMENT_LABELS = {
  1: 'First card minimum payment amount',
  2: 'Second card minimum payment amount',
  3: 'Third card minimum payment amount',
  4: 'Fourth card minimum payment amount',
  5: 'Fifth card minimum payment amount',
  6: 'Sixth card minimum payment amount',
  7: 'Seventh card minimum payment amount',
  8: 'Eighth card minimum payment amount',
  9: 'Ninth card minimum payment amount',
  10: 'Tenth card minimum payment amount',
  11: '11th card minimum payment amount',
  12: '12th card minimum payment amount',
  13: '13th card minimum payment amount',
  14: '14th card minimum payment amount',
  15: '15th card minimum payment amount',
  16: '16th card minimum payment amount',
  17: '17th card minimum payment amount',
  18: '18th card minimum payment amount',
  19: '19th card minimum payment amount',
  20: '20th card minimum payment amount',
  21: '21st card minimum payment amount',
  22: '22nd card minimum payment amount',
  23: '23rd card minimum payment amount',
  24: '24th card minimum payment amount',
  25: '25th card minimum payment amount',
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
