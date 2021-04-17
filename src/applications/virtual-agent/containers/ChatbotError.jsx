import React from 'react';
import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export default function ChatbotError() {
  return (
    <AlertBox
      content="We’re making some updates to the Virtual Agent. We’re sorry it’s not working right now. Please check back soon. If you require immediate assistance please call the VA.gov help desk at 800-698-2411 (TTY: 711)."
      headline=""
      onCloseAlert={function noRefCheck() {}}
      status="error"
    />
  );
}
