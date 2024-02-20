import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const BankruptcyQuestionReview = ({ data, goToPath, title }) => {
  const dispatch = useDispatch();
  const {
    questions,
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  // set reviewNavigation to true to show the review page alert
  const onReviewClick = () => {
    dispatch(
      setData({
        ...data,
        reviewNavigation: true,
      }),
    );
    goToPath('/bankruptcy-history');
  };

  return (
    <>
      {showReviewNavigation ? (
        <ReviewPageHeader title="bankruptcy history" goToPath={onReviewClick} />
      ) : null}
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
    </>
  );
};

BankruptcyQuestionReview.propTypes = {
  data: PropTypes.shape({
    questions: PropTypes.shape({
      hasBeenAdjudicatedBankrupt: PropTypes.bool,
    }),
  }),
  goToPath: PropTypes.func,
  title: PropTypes.string,
  'view:reviewPageNavigationToggle': PropTypes.bool,
};

export default BankruptcyQuestionReview;
