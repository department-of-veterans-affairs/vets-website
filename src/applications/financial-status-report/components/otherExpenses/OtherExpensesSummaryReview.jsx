import React from 'react';
import PropTypes from 'prop-types';
import { currency as currencyFormatter } from '../../utils/helpers';

const OtherExpensesSummaryReview = ({ data, title }) => {
  const { otherExpenses = [] } = data;

  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
      </div>
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
