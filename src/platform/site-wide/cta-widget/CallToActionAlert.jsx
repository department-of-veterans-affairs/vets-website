import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation/AlertBox';

export default function CallToActionAlert({
  heading,
  alertText,
  buttonText,
  buttonHandler,
  status,
}) {
  const alertProps = {
    headline: heading,
    content: (
      <div>
        {alertText}
        {buttonText && (
          <button className="va-button-primary" onClick={buttonHandler}>
            {buttonText}
          </button>
        )}
      </div>
    ),
    status,
  };

  return <AlertBox isVisible {...alertProps} />;
}
