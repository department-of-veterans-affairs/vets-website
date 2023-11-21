import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { setData } from 'platform/forms-system/src/js/actions';
import ReviewPageHeader from '../shared/ReviewPageHeader';

const formatTrueFalse = value => {
  return value ? 'Yes' : 'No';
};

const renderEmploymentSelection = (questions, isSpouse) => {
  return (
    <div
      className="review-row"
      key={isSpouse ? `spouse-question` : `vet-question`}
    >
      <dt>
        {isSpouse
          ? 'Spouse employed in the last two years '
          : 'Employed in the last two years'}
      </dt>
      <dd>
        {formatTrueFalse(
          isSpouse ? questions.spouseIsEmployed : questions.vetIsEmployed,
        )}
      </dd>
    </div>
  );
};

const EmploymentQuestionReview = ({ data, goToPath, name }) => {
  const dispatch = useDispatch();
  const {
    questions = [],
    'view:reviewPageNavigationToggle': showReviewNavigation,
  } = data;

  const isSpouse = name.toLowerCase().includes('spouse');

  // set reviewNavigation to true to show the review page alert
  const onReviewClick = () => {
    dispatch(
      setData({
        ...data,
        reviewNavigation: true,
      }),
    );
    goToPath('/employment-question');
  };

  // only show review navigation for veteran review
  //  question and if show review navigation feature flag is enabled
  return (
    <>
      {!isSpouse && showReviewNavigation ? (
        <ReviewPageHeader
          title="household income"
          goToPath={() => onReviewClick()}
        />
      ) : null}
      <div
        className="form-review-panel-page"
        key={
          isSpouse
            ? `spouse${questions.spouseIsEmployed}`
            : `vet${questions.vetIsEmployed}`
        }
      >
        <div className="form-review-panel-page-header-row">
          <h4 className="form-review-panel-page-header vads-u-font-size--h5">
            {isSpouse ? "Spouse's employment status" : 'Employment status'}
          </h4>
        </div>
        <dl className="review">
          {renderEmploymentSelection(questions, isSpouse)}
        </dl>
      </div>
    </>
  );
};

EmploymentQuestionReview.propTypes = {
  data: PropTypes.shape({
    questions: PropTypes.shape({
      spouseIsEmployed: PropTypes.bool,
      vetIsEmployed: PropTypes.bool,
    }),
    'view:reviewPageNavigationToggle': PropTypes.bool,
  }),
  goToPath: PropTypes.func,
  name: PropTypes.string,
};

export default EmploymentQuestionReview;
