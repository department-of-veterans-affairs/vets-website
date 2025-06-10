import React, { useMemo } from 'react';
import uniqueId from 'lodash/uniqueId';

/**
 * A component for the continue button to navigate through panels of questions.
 */
export default function ProgressButton({
  beforeText,
  afterText,
  submitButton,
  disabled,
  buttonClass,
  onButtonClick,
  preventOnBlur = e => e.preventDefault(),
  ariaLabel,
  ariaDescribedBy,
  buttonText,
}) {
  const id = useMemo(() => uniqueId(), []);

  let beforeTextElement = '';
  if (beforeText && beforeText === '«') {
    beforeTextElement = (
      <va-icon icon="navigate_far_before" class="vads-u-padding-right--1" />
    );
  } else if (beforeText) {
    beforeTextElement = (
      <span className="button-icon" aria-hidden="true">
        {beforeText}
        &nbsp;
      </span>
    );
  }

  let afterTextElement = '';
  if (afterText && afterText === '»') {
    afterTextElement = (
      <va-icon icon="navigate_far_next" class="vads-u-padding-left--1" />
    );
  } else if (afterText) {
    afterTextElement = (
      <span className="button-icon" aria-hidden="true">
        &nbsp;
        {afterText}
      </span>
    );
  }

  return (
    // aria-describedby tag to match "By submitting this form"
    // text for proper screen reader operation
    <button
      type={submitButton ? 'submit' : 'button'}
      disabled={disabled}
      className={`${buttonClass}${disabled ? ' usa-button-disabled' : ''}`}
      id={`${id}-continueButton`}
      onClick={onButtonClick}
      onMouseDown={preventOnBlur}
      aria-label={ariaLabel || null}
      aria-describedby={ariaDescribedBy}
    >
      {beforeTextElement}
      {buttonText}
      {afterTextElement}
    </button>
  );
}
