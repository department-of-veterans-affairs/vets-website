import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import _ from 'lodash/fp';
import classnames from 'classnames';
import moment from 'moment';

export default function FormQuestion({
  question,
  formState,
  setFormState,
  questionState,
  setQuestionState,
  scrollNext,
}) {
  const questionIndex = questionState.findIndex(el => el.id === question.id);

  function handleChange(event) {
    if (formState.startTime === null) {
      recordEvent({
        event: 'covid-screening-tool-start',
        'screening-tool-question': question.id,
      });
      // starts duration timer for GA
      setFormState({
        ...formState,
        startTime: moment().unix(),
      });
    }

    const newQuestionState = questionState;
    newQuestionState[questionIndex].value = event.target.value;

    console.log(newQuestionState);

    // sets the current question value in form state
    setQuestionState(newQuestionState);

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
        questionState[questionIndex].value === option.optionValue
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
