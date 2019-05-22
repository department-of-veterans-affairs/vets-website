import React from 'react';
import MessageTemplate from '../MessageTemplate';

const GenericError = () => {
  const content = {
    heading: 'We couldn’t connect you to our health tools',
    alertContent: (
      <>
        <p>
          We’re sorry. Something went wrong on our end, and we couldn’t connect
          you to health tools.
        </p>
      </>
    ),
    alertStatus: 'error',
    body: (
      <>
        <h3>What you can do:</h3>
        <p>Please try again later.</p>
      </>
    ),
  };

  return <MessageTemplate content={content} />;
};

export default GenericError;
