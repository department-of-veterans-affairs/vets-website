import React from 'react';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import navigationState from '../utilities/navigation/navigationState';

/**
 * A component for the continue button to navigate through panels of questions.
 */
const ProgressButton = props => {
  const {
    ariaDescribedBy,
    ariaLabel,
    buttonText,
    buttonClass,
    disabled,
    loading,
    onButtonClick,
    preventOnBlur,
    submitButton,
    // web component-only props
    useWebComponents = false,
    fullWidth,
  } = props;
  let { afterText = '', beforeText = '' } = props;
  let webComponentProps = {};

  const id = uniqueId();

  const handleClick = e => {
    navigationState.setNavigationEvent();
    // onButtonClick may not be present (see FormNavButtons)
    if (onButtonClick) {
      onButtonClick(e);
    }
  };

  if (!useWebComponents) {
    if (beforeText && beforeText === '«') {
      beforeText = (
        <va-icon icon="navigate_far_before" class="vads-u-padding-right--1" />
      );
    } else if (beforeText) {
      beforeText = (
        <span className="button-icon" aria-hidden="true">
          {beforeText}
          &nbsp;
        </span>
      );
    }

    if (afterText && afterText === '»') {
      afterText = (
        <va-icon icon="navigate_far_next" class="vads-u-padding-left--1" />
      );
    } else if (afterText) {
      afterText = (
        <span className="button-icon" aria-hidden="true">
          &nbsp;
          {afterText}
        </span>
      );
    }
  } else {
    // Remove class names that may interfere with the web component
    const vaButtonClass = buttonClass
      .replace('usa-button-primary', '')
      .replace('usa-button-secondary', '')
      .replace('vads-u-width--auto', '')
      .replace('usa-button-disabled', '')
      .replace('vads-u-width--full', '')
      .trim();

    webComponentProps = {
      back: beforeText === '«' ? true : null,
      class: vaButtonClass,
      continue: afterText === '»' ? true : null,
      disabled: disabled || null,
      'full-width': fullWidth ?? true,
      id: `${id}-continueButton`,
      label: ariaLabel || null,
      loading: loading || null,
      'message-aria-describedby': ariaDescribedBy || null,
      onClick: handleClick,
      // The web component does not support onMouseDown
      // onMouseDown: preventOnBlur,
      secondary: buttonClass.includes('usa-button-secondary') || null,
      submit: submitButton ? 'prevent' : null,
      text: buttonText,
    };
  }

  return useWebComponents ? (
    <va-button {...webComponentProps} />
  ) : (
    // aria-describedby tag to match "By submitting this form"
    // text for proper screen reader operation
    // eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component
    <button
      type={submitButton ? 'submit' : 'button'}
      disabled={disabled}
      className={`${buttonClass}${disabled ? ' usa-button-disabled' : ''}`}
      id={`${id}-continueButton`}
      onClick={handleClick}
      onMouseDown={preventOnBlur}
      aria-label={ariaLabel || null}
      aria-describedby={ariaDescribedBy}
    >
      {beforeText}
      {buttonText}
      {afterText}
    </button>
  );
};

ProgressButton.defaultProps = {
  preventOnBlur: e => {
    e.preventDefault();
  },
};

ProgressButton.propTypes = {
  // what CSS class(es) does the button have
  buttonClass: PropTypes.string.isRequired,
  // what is the button's label
  buttonText: PropTypes.string.isRequired,

  // Stores the value for the icon that will appear after the button text.
  afterText: PropTypes.string,

  // aria-described by attribute (id for button, text for va-button); needed to
  // associate the button with some content
  ariaDescribedBy: PropTypes.string,

  // aria-label attribute (id for button, text for va-button); needed for the
  // review & submit page "Update page" button
  ariaLabel: PropTypes.string,

  // Stores the value for the icon that will appear before the button text.
  beforeText: PropTypes.string,

  // is the button disabled or not
  disabled: PropTypes.bool,

  // Web component-only prop
  // If true, the button will take up the full width of its container
  fullWidth: PropTypes.bool,

  // web component-only loading state
  loading: PropTypes.bool,

  // function that bypasses onBlur when clicking
  preventOnBlur: PropTypes.func,

  // is this a submit button or not
  submitButton: PropTypes.bool,

  // If true, use the web component va-button
  // If false, use the standard HTML button
  // This is used to avoid a breaking change in the web component migration
  useWebComponents: PropTypes.bool,

  // function that changes the path to the next panel or submit.
  onButtonClick: PropTypes.func,
};

export default ProgressButton;
