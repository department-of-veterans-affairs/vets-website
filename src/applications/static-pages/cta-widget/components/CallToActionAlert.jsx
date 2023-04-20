import React from 'react';

export default function CallToActionAlert({
  heading,
  headerLevel,
  alertText,
  primaryButtonText,
  primaryButtonHandler,
  secondaryButtonText,
  secondaryButtonHandler,
  status,
  ariaLabel = null,
  ariaDescribedby = null,
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
          <button
            className={buttonClass}
            onClick={primaryButtonHandler}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
          >
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

  return (
    // TODO fix this
    <va-alert visible {...alertProps}>
      <h3 slot="headline">undefined</h3>
      <div>
        {alertText}
        {primaryButtonText && (
          <button
            className={buttonClass}
            onClick={primaryButtonHandler}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
          >
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
    </va-alert>
  );
}
