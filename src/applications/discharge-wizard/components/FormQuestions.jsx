// Dependencies.
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Scroll from 'react-scroll';

// Relative Imports
import { focusElement } from 'platform/utilities/ui';
import recordEvent from 'platform/monitoring/record-event';
import AnswerReview from './AnswerReview';
import Questions from './questions';

const scroller = Scroll.scroller;

const FormQuestions = ({ formValues, updateFormField }) => {
  useEffect(
    () => {
      // Helps screen reader read the next question
      const nextEl = formValues.questions.slice()[
        formValues.questions.length - 1
      ];
      const header = document.querySelector(`h4[class="${nextEl}_header"]`);
      if (header) {
        focusElement(header);
      }
    },
    [formValues.questions],
  );

  const scrollToLast = action => {
    setTimeout(() => {
      const el = formValues.questions.slice(-1)[0];
      scroller.scrollTo(
        el,
        window.VetsGov?.scroll || {
          duration: 1000,
          smooth: true,
        },
      );

      if (typeof action === 'function') {
        action();
      }
    }, 100);
  };

  const handleKeyDown = e => {
    // only scroll to next question if user tabs out of the current one
    if (
      !e.shiftKey &&
      e.keyCode === 9 &&
      ['INPUT', 'SELECT'].includes(document.activeElement.tagName)
    ) {
      const next = formValues.questions.slice(-1)[0];
      const curr = e.target.name;

      if (
        next &&
        curr &&
        parseInt(next.charAt(0), 10) > parseInt(curr.charAt(0), 10)
      ) {
        const el = formValues.questions.slice(-1)[0];
        scrollToLast(() => {
          (
            document.querySelector(`input[name="${el}"]`) ||
            document.querySelector(`select[name="${el}"]`)
          ).focus();
        });
      }
    }
  };

  const handleScrollTo = e => {
    e.preventDefault();

    recordEvent({ event: 'discharge-upgrade-review-edit' });

    scroller.scrollTo(
      e.target.name,
      window.VetsGov?.scroll || {
        duration: 1000,
        smooth: true,
        offset: -150,
      },
    );
    (
      document.querySelector(`input[name="${e.target.name}"]`) ||
      document.querySelector(`select[name="${e.target.name}"]`)
    ).focus();
  };

  return (
    <section className="dw-questions">
      {Questions.map((Question, index) => (
        <Question
          key={index + 1}
          formValues={formValues}
          handleKeyDown={handleKeyDown}
          scrollToLast={scrollToLast}
          updateField={updateFormField}
        />
      ))}
      <AnswerReview formValues={formValues} handleScrollTo={handleScrollTo} />
    </section>
  );
};

FormQuestions.propTypes = {
  updateFormField: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
};

export default FormQuestions;
