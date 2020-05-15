import React from 'react';
import MultiQuestionForm from '../components/MultiQuestionForm';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function App() {
  return (
    <div className="usa-width-one-whole">
      <AlertBox
        headline="Welcome to the VA COVID Screening Questionnaire"
        content="No personal data is collected or tracked."
        status="info"
        isVisible
      />
      <MultiQuestionForm />
    </div>
  );
}
