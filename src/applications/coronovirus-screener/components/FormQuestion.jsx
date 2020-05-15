import React from 'react';

export default function FormQuestion({ question, value, state, setFormState }) {
  function handleChange(event) {
    // sets the current question value in form state
    setFormState({
      ...state,
      [question.id]: event.target.value,
    });
  }

  return (
    <div className="feature">
      <h2>{question.text}</h2>

      <button
        type="button"
        className={`usa-button-big  ${
          value === 'true' ? 'usa-button' : 'usa-button-secondary'
        }`}
        onClick={handleChange}
        value="true"
      >
        Yes
      </button>
      <button
        type="button"
        className={`usa-button-big  ${
          value === 'false' ? 'usa-button' : 'usa-button-secondary'
        }`}
        onClick={handleChange}
        value="false"
      >
        No
      </button>
    </div>
  );
}
