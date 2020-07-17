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

  function QuestionOptions({ questionId, options }) {
    return options.map(option => (
      <>
        <input
          id={`option-${questionId}-${option.optionValue}`}
          key={`option-${questionId}-${option.optionValue}`}
          type="radio"
          onChange={handleClick}
          name={`option-${questionId}`}
          value={option.optionValue}
        />
        <label htmlFor={`option-${option.optionValue}`}>
          {option.optionText}
        </label>
      </>
    ));
  }

  const inputOptions = optionsConfig.map(option => (
    <>
      <label htmlFor={`option-${option.optionValue}`}>
        {option.optionText}
      </label>
      <input
        id={`option-${option.optionValue}`}
        key={`option-${option.optionValue}`}
        type="radio"
        // onClick={handleClick}
        name={'question'}
        value={option.optionValue}
      />
    </>
    // <button
    //   key={index}
    //   type="button"
    //   className={classnames(
    //     'usa-button-big',
    //     (question.value === option.optionValue ? 'usa-button' : null) ?? [
    //       'usa-button-secondary',
    //       'vads-u-background-color--white', // TODO: resolve upstream design system bug https://github.com/department-of-veterans-affairs/va.gov-team/issues/9610
    //     ],
    //   )}
    //   onClick={handleClick}
    //   value={option.optionValue}
    // >
    //   {option.optionText}
    // </button>
  ));

  return (
    <fieldset className="feature" id={`question-${question.id}`}>
      {/* <Element name={scrollElementName} /> */}
      <legend id={question.id}>{question.text}</legend>
      <QuestionOptions questionId={question.id} options={optionsConfig} />
    </fieldset>
  );
}
