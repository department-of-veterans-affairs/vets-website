import React from 'react';

export default function FormQuestion({
  question,
  value,
  state,
  setFormState,
  scrollNext,
}) {
  function handleChange(event) {
    // sets the current question value in form state
    setFormState({
      ...state,
      [question.id]: event.target.value,
    });
    scrollNext();
  }

  return (
    <div className="feature">
      <h2>{question.text}</h2>

      <button
        type="button"
        className={`usa-button-big  ${
          value === 'yes' ? 'usa-button' : 'usa-button-secondary'
        }`}
        onClick={handleChange}
        value="yes"
      >
        Yes
      </button>
      <button
        type="button"
        className={`usa-button-big  ${
          value === 'no' ? 'usa-button' : 'usa-button-secondary'
        }`}
        onClick={handleChange}
        value="no"
      >
        No
      </button>
    </div>
  );
}
