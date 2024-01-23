import React from 'react';

export default function CallToActionAlert({
  heading,
  headerLevel = 3,
  alertText,
  primaryButtonText,
  primaryButtonHandler,
  secondaryButtonText,
  secondaryButtonHandler,
  status,
  ariaLabel = null,
  ariaDescribedby = null,
}) {
  const CustomHeaderLevel = `h${headerLevel}`;
  return (
    <va-alert visible status={status}>
      <CustomHeaderLevel slot="headline">{heading}</CustomHeaderLevel>
      <div>
        {alertText}
        {primaryButtonText && (
          <va-button
            onClick={primaryButtonHandler}
            text={primaryButtonText}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedby}
          />
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
