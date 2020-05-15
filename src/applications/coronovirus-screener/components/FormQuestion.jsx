import React from 'react';

export default function FormQuestion({
  question,
  formState,
  setFormState,
  scrollNext,
}) {
  function handleChange(event) {
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
    <div className="feature">
      <h2>{question.text}</h2>
      {options}
    </div>
  );
}
