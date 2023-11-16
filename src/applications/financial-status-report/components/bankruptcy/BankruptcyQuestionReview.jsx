import React from 'react';
import PropTypes from 'prop-types';

const BankruptcyQuestionReview = ({ data, title }) => {
  const { questions } = data;
  return (
    <div className="form-review-panel-page">
      <div className="form-review-panel-page-header-row">
        <h4 className="form-review-panel-page-header vads-u-font-size--h5">
          {title}
        </h4>
      </div>
      <dl className="review">
        <div className="review-row">
          <dt>Have you ever declared bankruptcy?</dt>
          <dd>{questions?.hasBeenAdjudicatedBankrupt ? 'Yes' : 'No'}</dd>
        </div>
      </dl>
    </div>
  );
};

BankruptcyQuestionReview.propTypes = {
  data: PropTypes.shape({
    questions: PropTypes.shape({
      hasBeenAdjudicatedBankrupt: PropTypes.bool,
    }),
  }),
  title: PropTypes.string,
};

export default BankruptcyQuestionReview;
