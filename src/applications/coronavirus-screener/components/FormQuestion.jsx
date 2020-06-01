import React from 'react';
import _ from 'lodash/fp';
import classnames from 'classnames';

export default function FormQuestion({
  question,
  questionIndex,
  questionState,
  setQuestionState,
  scrollNext,
  recordStart,
}) {
  function handleChange(event) {
    recordStart(question.id);
    const newQuestionState = questionState;
    newQuestionState[questionIndex].value = event.target.value;

    // sets the current question value in form state
    setQuestionState([...newQuestionState]);
    scrollNext();
  }

  const optionsConfig = [
    { optionValue: 'yes', optionText: 'Yes' },
    { optionValue: 'no', optionText: 'No' },
  ];

  const options = optionsConfig.map((option, index) => (
    <button
      key={index}
      type="button"
      className={classnames(
        'usa-button-big',
        Object.prototype.hasOwnProperty.call(
          questionState[questionIndex],
          'value',
        ) && questionState[questionIndex].value === option.optionValue
          ? 'usa-button'
          : 'usa-button-secondary',
      )}
      onClick={handleChange}
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
