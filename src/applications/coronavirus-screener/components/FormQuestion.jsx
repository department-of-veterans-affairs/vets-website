import React, { useEffect } from 'react';
import _ from 'lodash/fp';
import classnames from 'classnames';
import { Element } from 'react-scroll';
import { scrollerTo } from '../lib';

export default function FormQuestion({
  question,
  recordStart,
  optionsConfig,
  setQuestionValue,
  clearQuestionValues,
}) {
  const scrollElementName = `multi-question-form-${question.id}-scroll-element`;

  function handleClick(event) {
    recordStart(question.id);
    setQuestionValue({ event, questionId: question.id });
    if (question.clearValues ?? false) {
      clearQuestionValues(question.id);
    }
  }

  useEffect(() => {
    // do not scroll for first question
    if (question.startQuestion !== true) {
      scrollerTo(scrollElementName);
    }
  });

  const options = optionsConfig.map((option, index) => (
    <button
      key={index}
      type="button"
      className={classnames(
        'usa-button-big',
        (question.value === option.optionValue ? 'usa-button' : null) ?? [
          'usa-button-secondary',
          'vads-u-background-color--white', // TODO: resolve upstream design system bug https://github.com/department-of-veterans-affairs/va.gov-team/issues/9610
        ],
      )}
      onClick={handleClick}
      value={option.optionValue}
    >
      {option.optionText}
    </button>
  ));

  return (
    <div className="feature" id={`question-${question.id}`}>
      <Element name={scrollElementName} />
      <h2>{question.text}</h2>
      {options}
    </div>
  );
}
