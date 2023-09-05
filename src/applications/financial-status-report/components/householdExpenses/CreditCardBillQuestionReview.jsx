import React from 'react';
import PropTypes from 'prop-types';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const CreditCardBillQuestionReview = ({ data, goToPath, title }) => {
  const { expenses, questions, utilityRecords = [] } = data;
  const { expenseRecords = [] } = expenses;

  return (
    <>
      {expenseRecords.length > 0 || utilityRecords.length > 0 ? null : (
        <ReviewPageHeader
          title="household expenses"
          goToPath={() => goToPath('/expenses-explainer')}
        />
      )}
      <div className="form-review-panel-page">
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {title}
          </h4>
        </div>
        <dl className="review">
          <div className="review-row">
            <dt>Do you have any past-due credit card bills?</dt>
            <dd>{questions?.hasCreditCardBills ? 'Yes' : 'No'}</dd>
          </div>
        </dl>
      </div>
    </>
  );
};

CreditCardBillQuestionReview.propTypes = {
  data: PropTypes.shape({
    expenses: PropTypes.shape({
      expenseRecords: PropTypes.array,
    }),
    questions: PropTypes.shape({
      hasCreditCardBills: PropTypes.bool,
    }),
    utilityRecords: PropTypes.array,
  }),
  goToPath: PropTypes.func,
  title: PropTypes.string,
};

export default CreditCardBillQuestionReview;
