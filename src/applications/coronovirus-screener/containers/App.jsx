import React from 'react';
import FormContainer from './FormContainer';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function App() {
  return (
    <div className="usa-width-one-whole">
      <AlertBox
        headline="Informational alert"
        content="Welcome to the VA COVID Screening Questionnaire! No personal data is collected or tracked."
        status="info"
        isVisible
      />
      <FormContainer />
    </div>
  );
}
