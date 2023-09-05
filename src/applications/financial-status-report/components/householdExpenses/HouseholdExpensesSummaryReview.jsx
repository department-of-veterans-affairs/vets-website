import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const HouseholdExpensesSummaryReview = ({ data, goToPath }) => {
  const { expenseRecords = [] } = data?.expenses;

  return (
    <>
      <ReviewPageHeader
        title="household expenses"
        goToPath={() => goToPath('/expenses-explainer')}
      />
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
    </>
  );
};

HouseholdExpensesSummaryReview.propTypes = {
  data: PropTypes.shape({
    expenses: PropTypes.shape({ expenseRecords: PropTypes.array }),
  }),
  goToPath: PropTypes.func,
};

export default HouseholdExpensesSummaryReview;
