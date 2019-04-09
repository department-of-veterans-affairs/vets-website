import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

export default function CallToActionAlert({
  heading,
  alertText,
  primaryButtonText,
  primaryButtonHandler,
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
        {primaryButtonText && (
          <button className={buttonClass} onClick={primaryButtonHandler}>
            {primaryButtonText}
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
