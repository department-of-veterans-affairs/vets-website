import React from 'react';
import CollapsiblePanel from '@department-of-veterans-affairs/formation-react/CollapsiblePanel';

export default function FormQuestion(props) {
  function handleChange(event) {
    props.onChange(event.target.value);
  }

  return (
    <CollapsiblePanel panelName={props.panelName}>
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
    </CollapsiblePanel>
  );
}
