import React from 'react';
import _ from 'lodash/fp';
import classnames from 'classnames';

export default function FormQuestion({
  question,
  scrollNext,
  recordStart,
  optionsConfig,
  handleQuestionClick,
}) {
  function handleClick(event) {
    recordStart(question.id);
    handleQuestionClick({ event, questionId: question.id });
    scrollNext();
  }

  // console.log('question', question);

  const options = optionsConfig.map((option, index) => (
    <button
      key={index}
      type="button"
      className={classnames(
        'usa-button-big',
        (question.value === option.optionValue ? 'usa-button' : null) ??
          'usa-button-secondary',
      )}
      onClick={handleClick}
      value={option.optionValue}
    >
      {option.optionText}
    </button>
  ));

  return (
    <div className="feature">
      <h2>{question.text}</h2>
      {options}
    </div>
  );
}
