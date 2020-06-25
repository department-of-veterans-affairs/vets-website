import React from 'react';
import _ from 'lodash/fp';
import classnames from 'classnames';

export default function FormQuestion({
  question,
  scrollNext,
  recordStart,
  optionsConfig,
  setQuestionValue,
  clearQuestionValues,
}) {
  function handleClick(event) {
    recordStart(question.id);
    setQuestionValue({ event, questionId: question.id });
    if (question.clearValues ?? false) {
      clearQuestionValues(question.id);
    }
    scrollNext();
  }

  // console.log('question', question);

  const options = optionsConfig.map((option, index) => (
    <label for="">
      <input id={index}
        key={index}
        type="radio"
        className={classnames(
          'usa-button-big',
          (question.value === option.optionValue ? 'usa-button' : null) ??
            'usa-button-secondary',
        )}
        onClick={handleClick}
        name={option.optionValue}
        value={option.optionValue}
      >
      </input>
      {option.optionText}
    </label>
  ));

  return (
    <div className="feature">
      <fieldset class="feature">
        <legend id="{question.id}">{question.text}</legend>
        {options}
      </fieldset>
    </div>
  );
}
