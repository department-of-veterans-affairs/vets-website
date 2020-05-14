import React from 'react';

export default function FormQuestion(props) {
  function handleChange(event) {
    props.onChange(event.target.value);
  }

  return (
    <div className="feature" panelName={props.panelName}>
      <div>{props.question.text}</div>

      <button
        type="button"
        className={`usa-button-big  ${
          props.value === 'true' ? 'usa-button' : 'usa-button-secondary'
        }`}
        onClick={handleChange}
        value="true"
      >
        Yes
      </button>
      <button
        type="button"
        className={`usa-button-big  ${
          props.value === 'false' ? 'usa-button' : 'usa-button-secondary'
        }`}
        onClick={handleChange}
        value="false"
      >
        No
      </button>
      {props.value}
    </div>
  );
}
