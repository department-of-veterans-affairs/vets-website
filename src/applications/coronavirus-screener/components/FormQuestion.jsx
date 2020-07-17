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

  function QuestionOptions({ questionId, questionValue, options }) {
    return options.map(option => (
      <>
        <input
          id={`option-${questionId}-${option.optionValue}`}
          key={`option-${questionId}-${option.optionValue}`}
          type="radio"
          onChange={handleClick}
          name={`option-${questionId}`}
          value={option.optionValue}
          checked={option.optionValue === questionValue}
        />
        <label htmlFor={`option-${option.optionValue}`}>
          {option.optionText}
        </label>
      </>
    ));
  }

  return (
    <div className="feature">
      <Element name={scrollElementName} />
      <fieldset id={`question-${question.id}`}>
        <legend id={question.id}>{question.text}</legend>
        <QuestionOptions
          questionId={question.id}
          options={optionsConfig}
          questionValue={question.value}
        />
      </fieldset>
    </div>
  );
}
