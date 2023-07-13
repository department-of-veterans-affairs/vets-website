import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const CreditCardBillsSummaryReview = ({ data, title }) => {
  const { creditCardBills = [] } = data.expenses;

  return (
    <div>
      <h4>{title}</h4>
      <dl className="review">
        {creditCardBills.map((bill, index) => {
          return (
            <>
              <div
                className="review-row"
                key={bill.purpose + bill.amountDueMonthly + index}
              >
                <dt>Unpaid balance</dt>
                <dd>{currencyFormatter(bill.unpaidBalance)}</dd>
              </div>
              <div
                className="review-row"
                key={bill.purpose + bill.amountDueMonthly + index}
              >
                <dt>Minimum monthly payment amount</dt>
                <dd>{currencyFormatter(bill.amountDueMonthly)}</dd>
              </div>
              <br />
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
