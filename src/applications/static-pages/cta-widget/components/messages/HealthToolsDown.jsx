import React from 'react';
import CallToActionAlert from '../CallToActionAlert';

const HealthToolsDown = () => {
  const content = {
    heading: 'We couldn’t connect you to our health tools',
    alertText: (
      <>
        <p>
          We’re sorry. Something went wrong on our end, and we couldn’t connect
          you to our health tools.
        </p>

        <h5>What you can do</h5>
        <p className="vads-u-margin-top--0">Please try again later.</p>
      </>
    ),
    status: 'error',
  };

  return <CallToActionAlert {...content} />;
};

export default HealthToolsDown;
