import React from 'react';
import { questions } from '../questions';
import FormQuestion from '../components/FormQuestion';

export default function FormContainer() {
  const [feverValue, setFeverValue] = React.useState(null);
  const [coughValue, setCoughValue] = React.useState(null);
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
        question={questions.cough}
        value={coughValue}
        onChange={setCoughValue}
        panelName="Question 2"
      />
      <FormQuestion
        question={questions.flu}
        value={fluValue}
        onChange={setFluValue}
        panelName="Question 3"
      />
      <div>feverValue: {feverValue}</div>
      <div>coughValue: {coughValue}</div>
      <div>fluValue: {fluValue}</div>
    </div>
  );
}
