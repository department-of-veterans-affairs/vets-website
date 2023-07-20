import React from 'react';
import PropTypes from 'prop-types';

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

const EmploymentQuestionSummaryReview = ({ data, name }) => {
  const { questions = [] } = data;

  const isSpouse = name.toLowerCase().includes('spouse');

  return (
    <>
      <div
        className="form-review-panel-page"
        key={
          isSpouse
            ? `spouse${questions.spouseIsEmployed}`
            : `vet${questions.vetIsEmployed}`
        }
      >
        <div className="form-review-panel-page-header-row">
          <h4 className="vads-u-font-size--h5">
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

EmploymentQuestionSummaryReview.propTypes = {
  data: PropTypes.shape({
    questions: PropTypes.shape({
      spouseIsEmployed: PropTypes.bool,
      vetIsEmployed: PropTypes.bool,
    }),
  }),
  name: PropTypes.string,
};

export default EmploymentQuestionSummaryReview;
