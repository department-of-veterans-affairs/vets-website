import React from 'react';

const errorMessage = (
  <>
    We’re making some updates to the Virtual Agent. We’re sorry it’s not working
    right now. Please check back soon. If you require immediate assistance
    please call the VA.gov help desk at{' '}
    <va-telephone contact="8006982411" aria-label="8 0 0. 6 9 8. 2 4 1 1." />(
    <va-telephone contact="711" aria-label="TTY: 7 1 1." />
    ).
  </>
);

export default function ChatbotError() {
  return <va-alert status="error">{errorMessage}</va-alert>;
}
