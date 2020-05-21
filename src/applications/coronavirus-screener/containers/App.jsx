import React from 'react';
import MultiQuestionForm from '../components/MultiQuestionForm';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { questions } from '../config/questions';

export default function App() {
  return (
    <div className="vads-l-grid-container">
      <AlertBox
        headline="As part of our coronavirus screening, you'll need to answer some questions before entering a VA facility."
        content="We won't store or share your data."
        status="info"
        isVisible
      />
      <MultiQuestionForm questions={questions} />
    </div>
  );
}
