import React from 'react';
import { questions } from '../config/questions';
import { Element } from 'react-scroll';
import moment from 'moment';

export default function FormResult({ formState }) {
  let result;

  const incomplete = <div>Please answer all the questions above.</div>;

  const dateText = moment().format('dddd, MMMM D, h:mm a');

  const pass = (
    <div>
      <h2 className="vads-u-font-size--h1">PASS</h2>
      <h3>Valid for:</h3>
      <h3>{dateText}</h3>
      <div className="vads-u-font-size--h3">
        <p>
          Please show this screen to the staff member at the facility entrance.
        </p>
        <p>Thank you for helping us protect you and others during this time.</p>
      </div>
    </div>
  );

  const fail = (
    <div>
      <h2 className="vads-u-font-size--h1">More screening needed</h2>
      <h3>Valid for:</h3>
      <h3>{dateText}</h3>
      <div className="vads-u-font-size--h3">
        <p>
          Please show this screen to the staff member at the facility entrance.
        </p>
        <p>Thank you for helping us protect you and others during this time.</p>
      </div>
    </div>
  );

  if (Object.values(formState).length < questions.length) {
    result = incomplete;
  } else if (Object.values(formState).includes('yes')) {
    result = fail;
  } else {
    result = pass;
  }

  return (
    <div className="feature">
      <Element
        name={`multi-question-form-${questions.length}-scroll-element`}
      />
      <h2>Result:</h2>
      <div>{result}</div>
    </div>
  );
}
