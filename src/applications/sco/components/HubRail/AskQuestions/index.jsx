import React from 'react';
import ScoResourceMatrix from './scoResourceMatrix';
import MessageUs from './messageUs';
import CallUs from './callUs';
import AdditionalContacts from './additionalContacts';

const AskQuestions = () => {
  return (
    <va-accordion-item level="3" open="true" header="Ask questions" uswds>
      <ScoResourceMatrix />
      <MessageUs />
      <CallUs />
      <AdditionalContacts />
    </va-accordion-item>
  );
};

export default AskQuestions;
