// Dependencies.
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Scroll from 'react-scroll';

// Relative Imports
import { answerReview, shouldShowQuestion } from '../helpers';

const { Element } = Scroll;

const AnswerReview = ({ formValues, handleScrollTo }) => {
  if (!formValues) {
    return null;
  }

  if (formValues?.questions.slice(-1)[0] !== 'END') {
    return null;
  }

  return (
    <div>
      <Element name="END" />
      <h2>Review your answers</h2>
      <div className="va-introtext">
        <p>
          If any information below is incorrect, update your answers to get the
          most accurate information regarding your discharge situation.
        </p>
      </div>
      <div className="answers vads-u-margin-bottom--2">
        {Object.keys(formValues).map(k => {
          if (k === 'questions') {
            return null;
          }

          const reviewLabel = answerReview(k, formValues);

          return (
            reviewLabel &&
            shouldShowQuestion(k, formValues.questions) && (
              <div key={k} className="answer-review">
                <p className="vads-u-padding-right--2">{reviewLabel}</p>
                <va-link
                  disable-analytics
                  href="#"
                  onClick={handleScrollTo}
                  name={k}
                  text="Edit"
                  aria-label={reviewLabel}
                />
              </div>
            )
          );
        })}
      </div>
      <Link to="/guidance" className="vads-c-action-link--green">
        Get my results
      </Link>
    </div>
  );
};

AnswerReview.propTypes = {
  handleScrollTo: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default AnswerReview;
