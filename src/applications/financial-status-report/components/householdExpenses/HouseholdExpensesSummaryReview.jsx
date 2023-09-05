import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const HouseholdExpensesSummaryReview = ({ data }) => {
  const { expenseRecords = [] } = data.expenses;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          Housing expenses
        </h4>
      </div>
      <dl className="review">
        {expenseRecords.map((expense, index) => {
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

HouseholdExpensesSummaryReview.propTypes = {
  data: PropTypes.shape({
    expenses: PropTypes.shape({ expenseRecords: PropTypes.array }),
  }),
  title: PropTypes.string,
};

export default HouseholdExpensesSummaryReview;
