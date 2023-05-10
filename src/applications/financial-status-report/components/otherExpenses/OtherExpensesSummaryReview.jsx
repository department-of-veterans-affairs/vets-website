import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherExpensesSummaryReview = ({ data, title }) => {
  const { otherExpenses = [] } = data;

  return (
    <div>
      <h4>{title}</h4>
      <dl className="review">
        {otherExpenses.map((expense, index) => {
          return (
            <div
              className="review-row"
              key={expense.name + expense.amount + index}
            >
              <dt>{expense.name}</dt>
              <dd>{currencyFormatter(expense.amount)}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
};

OtherExpensesSummaryReview.propTypes = {
  data: PropTypes.shape({
    otherExpenses: PropTypes.array,
  }),
  title: PropTypes.string,
};

export default OtherExpensesSummaryReview;
