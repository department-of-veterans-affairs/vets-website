import React from 'react';
import recordEvent from 'platform/monitoring/record-event';
import _ from 'lodash/fp';
import moment from 'moment';

export default function FormQuestion({
  question,
  formState,
  setFormState,
  resultSubmitted,
  setResultSubmittedState,
  scrollNext,
}) {
  function handleChange(event) {
    if (_.isEmpty(formState)) {
      recordEvent({
        event: 'covid-screening-tool-start',
        'screening-tool-question': question.id,
      });
      // starts duration timer for GA
      setResultSubmittedState({
        ...resultSubmitted,
        startTime: moment().unix(),
      });
    }
    // sets the current question value in form state
    setFormState({
      ...formState,
      [question.id]: event.target.value,
    });
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
      className={`usa-button-big  ${
        formState[question.id] === option.optionValue
          ? 'usa-button'
          : 'usa-button-secondary'
      }`}
      onClick={handleChange}
      value={option.optionValue}
    >
      {option.optionText}
    </button>
  ));

  return (
    <div id={`question-${question.id}`} className="feature">
      <h2>{question.text}</h2>
      {options}
    </div>
  );
}
