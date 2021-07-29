import React from 'react';
import { focusElement } from 'platform/utilities/ui';

export default function LearnMoreLabel({
  ariaLabel,
  labelFor,
  onClick,
  text,
  buttonId,
  bold,
}) {
  let displayText = text && <React.Fragment>{text} </React.Fragment>;
  if (labelFor && text) {
    displayText = (
      <label
        className="vads-u-margin--0 vads-u-margin-right--0p5 vads-u-display--inline-block"
        htmlFor={labelFor}
      >
        {text}
      </label>
    );
  }

  return (
    <span
      className="vads-u-margin--0 vads-u-display--inline-block "
      onClick={focusElement(labelFor)}
    >
      {bold ? <strong>{displayText}</strong> : displayText}
      <span className="vads-u-margin--0 vads-u-display--inline-block ">
        (
        <button
          id={buttonId}
          aria-label={ariaLabel}
          type="button"
          className="va-button-link learn-more-button vads-u-margin--0"
          onClick={onClick}
        >
          Learn more
        </button>
        )
      </span>
    </span>
  );
}
