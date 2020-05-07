import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function ChatbotLoadError() {
  const alertMessage = (
    <div>
      <p>
        Please make sure you’re connected to the internet, and refresh this page
        to try again.
      </p>
      <p>
        If it still doesn’t work, you may need to clear your internet browser’s
        history (sometimes called “cached data”). You can find how to do this
        within your browser’s privacy and security settings.
      </p>
    </div>
  );

  return (
    <AlertBox
      headline="We can’t load the chatbot"
      content={alertMessage}
      status="error"
    />
  );
}
