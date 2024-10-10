// Dependencies.
import React from 'react';
import PropTypes from 'prop-types';

import { Element } from 'platform/utilities/scroll';

// Relative Imports
import { answerReview, shouldShowQuestion } from '../helpers';
import { ROUTES } from '../constants';

const AnswerReview = ({ formValues, handleScrollTo, router }) => {
  if (!formValues) {
    return null;
  }

  if (formValues?.questions.slice(-1)[0] !== 'END') {
    return null;
  }

  const getResults = event => {
    event.preventDefault();
    router.push(ROUTES.GUIDANCE);
  };

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
                  label={reviewLabel}
                />
              </div>
            )
          );
        })}
      </div>
      <va-link-action
        onClick={getResults}
        data-testid="duw-guidance"
        href="#"
        text="Get my results"
      />
    </div>
  );
};

AnswerReview.propTypes = {
  handleScrollTo: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default AnswerReview;
