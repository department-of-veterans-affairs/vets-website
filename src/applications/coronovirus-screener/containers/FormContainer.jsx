import React from 'react';
import { questions } from '../questions';
import FormQuestion from '../components/FormQuestion';

export default function FormContainer() {
  const [feverValue, setFeverValue] = React.useState(null);
  const [fluValue, setFluValue] = React.useState(null);

  return (
    <div>
      <FormQuestion
        question={questions.fever}
        value={feverValue}
        onChange={setFeverValue}
        panelName="Question 1"
      />
      <FormQuestion
        question={questions.flu}
        value={fluValue}
        onChange={setFluValue}
        panelName="Question 2"
      />
      <div>feverValue: {feverValue}</div>
      <div>fluValue: {fluValue}</div>
    </div>
  );
}
