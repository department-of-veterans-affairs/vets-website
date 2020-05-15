import React from 'react';
import { questions } from '../config/questions';
import { Element } from 'react-scroll';

export default function FormResult({ formState }) {
  let result;

  // check if questions have all been answered

  if (Object.values(formState).length < questions.length) {
    result = 'incomplete';
  } else if (Object.values(formState).includes('yes')) {
    result = 'fail';
  } else {
    result = 'pass';
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
