import React from 'react';
import { questions } from '../questions';
import FormQuestion from './FormQuestion';

export default function MultiQuestionForm() {
  const [formState, setFormState] = React.useState({});

  return (
    <div>
      <FormQuestion
        question={questions.fever}
        value={formState.feverValue}
        setFormState={setFormState}
        state={formState}
      />
      <FormQuestion
        question={questions.cough}
        value={formState.coughValue}
        setFormState={setFormState}
        state={formState}
      />
      <FormQuestion
        question={questions.flu}
        value={formState.fluValue}
        setFormState={setFormState}
        state={formState}
      />
      <div>feverValue: {formState.feverValue}</div>
      <div>coughValue: {formState.coughValue}</div>
      <div>fluValue: {formState.fluValue}</div>
    </div>
  );
}
