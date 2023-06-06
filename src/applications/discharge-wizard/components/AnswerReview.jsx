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
      <table className="usa-table-borderless">
        <tbody>
          {Object.keys(formValues).map(k => {
            if (k === 'questions') {
              return null;
            }

            const reviewLabel = answerReview(k, formValues);

            return (
              reviewLabel &&
              shouldShowQuestion(k, formValues.questions) && (
                <tr key={k}>
                  <td>
                    <p>{reviewLabel}</p>
                  </td>
                  <td>
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a
                      href="#"
                      onClick={handleScrollTo}
                      name={k}
                      aria-label={reviewLabel}
                    >
                      Edit
                    </a>
                  </td>
                </tr>
              )
            );
          })}
        </tbody>
      </table>
      <Link to="/guidance" className="usa-button-primary va-button">
        Get my results »
      </Link>
    </div>
  );
};

AnswerReview.propTypes = {
  handleScrollTo: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default AnswerReview;
