import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import recordEvent from 'platform/monitoring/record-event';
import { focusElement, getScrollOptions } from 'platform/utilities/ui';
import scrollTo from 'platform/utilities/ui/scrollTo';
import AnswerReview from './AnswerReview';
import Questions from './questions';

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
      scrollTo(
        el,
        getScrollOptions() || {
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

    const name = e.target.getAttribute('name');

    recordEvent({ event: 'discharge-upgrade-review-edit' });

    scrollTo(
      name,
      getScrollOptions() || {
        duration: 1000,
        smooth: true,
        offset: -150,
      },
    );
    (
      document.querySelector(`input[name="${name}"]`) ||
      document.querySelector(`select[name="${name}"]`)
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
