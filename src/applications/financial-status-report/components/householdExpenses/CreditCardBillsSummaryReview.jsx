import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const CreditCardBillsSummaryReview = ({ data }) => {
  const { creditCardBills = [] } = data.expenses;

  return (
    <div>
      <dl className="review">
        {creditCardBills.map((bill, index) => {
          return (
            <>
              <h5>Credit card bill {index + 1}</h5>
              <div className="review-row" key={bill.amountDueMonthly + index}>
                <dt>Unpaid balance</dt>
                <dd>{currencyFormatter(bill.unpaidBalance)}</dd>
              </div>
              <div
                className="review-row"
                key={bill.amountDueMonthly + index + 1}
              >
                <dt>Minimum monthly payment amount</dt>
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
