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

  return (
    <div className="feature">
      <h2>{question.text}</h2>

      {/* yes button */}
      <button
        type="button"
        className={`usa-button-big  ${
          formState[question.id] === 'yes'
            ? 'usa-button'
            : 'usa-button-secondary'
        }`}
        onClick={handleChange}
        value="yes"
      >
        Yes
      </button>
      {/* no button */}
      <button
        type="button"
        className={`usa-button-big  ${
          formState[question.id] === 'no'
            ? 'usa-button'
            : 'usa-button-secondary'
        }`}
        onClick={handleChange}
        value="no"
      >
        No
      </button>
    </div>
  );
}
