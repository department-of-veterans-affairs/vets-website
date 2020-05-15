import React from 'react';
import MultiQuestionForm from '../components/MultiQuestionForm';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { questions } from '../config/questions';

export default function App() {
  return (
    <div className="vads-l-grid-container">
      <AlertBox
        headline="Welcome to the VA COVID Screening Questionnaire"
        content="No personal data is collected or tracked."
        status="info"
        isVisible
      />
      <MultiQuestionForm questions={questions} />
    </div>
  );
}
