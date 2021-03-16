import React from 'react';

import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';

export default function CallToActionAlert({
  heading,
  headerLevel,
  alertText,
  primaryButtonText,
  primaryButtonHandler,
  secondaryButtonText,
  secondaryButtonHandler,
  status,
}) {
  const buttonClass =
    status === 'continue' ? 'va-button-primary' : 'usa-button-primary';

  const alertProps = {
    headline: heading,
    level: headerLevel,
    content: (
      <div>
        {alertText}
        {primaryButtonText && (
          <button className={buttonClass} onClick={primaryButtonHandler}>
            {primaryButtonText}
          </button>
        )}
        {secondaryButtonText && (
          <button
            className="va-button-link vads-u-margin-left--2"
            onClick={secondaryButtonHandler}
          >
            {secondaryButtonText}
          </button>
        )}
      </div>
    ),
    status,
  };

  return <AlertBox isVisible {...alertProps} />;
}
