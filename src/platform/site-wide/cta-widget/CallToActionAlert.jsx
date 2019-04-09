import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function CallToActionAlert({
  heading,
  alertText,
  buttonText,
  buttonHandler,
  secondaryLinkText,
  secondaryLinkHandler,
  status,
}) {
  const buttonClass =
    status === 'continue' ? 'va-button-primary' : 'usa-button-primary';

  const alertProps = {
    headline: heading,
    content: (
      <div>
        {alertText}
        {buttonText && (
          <button className={buttonClass} onClick={buttonHandler}>
            {buttonText}
          </button>
        )}
        {secondaryLinkText && (
          <button className="va-button-link" onClick={secondaryLinkHandler}>
            {secondaryLinkText}
          </button>
        )}
      </div>
    ),
    status,
  };

  return <AlertBox isVisible {...alertProps} />;
}
