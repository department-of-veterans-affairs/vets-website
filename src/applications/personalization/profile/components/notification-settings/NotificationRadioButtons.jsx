import PropTypes from 'prop-types';
import React from 'react';
import { isArray, isString, uniqueId } from 'lodash';
import classNames from 'classnames';
import { makeField } from '~/platform/forms/fields';

const MessageWrapper = ({ children, classes, id }) => {
  return (
    <span
      id={id}
      className={classNames(
        'vads-u-margin-top--0p5',
        'rb-input-message',
        'vads-u-font-weight--bold',
        classes,
      )}
    >
      {children}
    </span>
  );
};

/**
 * A radio button group with a label.
 *
 * Validation has the following props.
 *
 * - `additionalFieldsetClass` String for any additional fieldset classes.
 * - `additionalLegendClass` String for any additional legend classes.
 * - `errorMessage` String Error message for the radio button group
 * - `warningMessage` String Warning message for the radio button group
 * - `loadingMessage` String Loading message for the radio button group
 * - `successMessage` String Success message for the radio button group
 * - `label` String for the group field label.
 * - `name` String for the name attribute.
 * - `options` Array of options to populate group.
 * - `required` is this field required.
 * - `value` string. Value of the select field.
 * - `onValueChange` a function with this prototype: (newValue)
 * - `onMouseDown` a function for mouse down
 * - `onKeyDown` a function for key down
 * - `ariaDescribedby` Array matching the options, added when the option is
 *   selected
 */
const NotificationRadioButtons = ({
  id = uniqueId('notification-radio-buttons-'),
  additionalFieldsetClass,
  additionalLegendClass,
  description,
  errorMessage,
  warningMessage,
  loadingMessage,
  successMessage,
  label,
  name,
  options,
  required,
  value,
  onValueChange,
  ariaDescribedby,
  onMouseDown,
  onKeyDown,
  disabled,
}) => {
  const handleChange = domEvent => {
    const optionValue = domEvent.target.value;
    // removed analytics here
    onValueChange(makeField(optionValue, true));
  };

  let errorSpan = '';
  let errorSpanId = undefined;
  if (errorMessage) {
    errorSpanId = `${id}-error-message`;
    errorSpan = (
      <MessageWrapper id={errorSpanId} classes={'rb-input-message-error'}>
        <i
          className="fas fa-exclamation-circle vads-u-margin-right--1"
          aria-hidden="true"
        />{' '}
        <span className="sr-only">Error</span> {errorMessage}
      </MessageWrapper>
    );
  }

  let warningSpan = '';
  let warningSpanId = undefined;
  if (warningMessage) {
    warningSpanId = `${id}-warning-message`;
    warningSpan = (
      <MessageWrapper id={warningSpanId} classes={'rb-input-message-warning'}>
        <i
          className="fas fa-exclamation-triangle vads-u-margin-right--1"
          aria-hidden="true"
        />{' '}
        <span className="sr-only">Warning</span> {warningMessage}
      </MessageWrapper>
    );
  }

  let loadingSpan = '';
  let loadingSpanId = undefined;
  if (loadingMessage) {
    loadingSpanId = `${id}-loading-message`;
    loadingSpan = (
      <MessageWrapper id={loadingSpanId} classes="vads-u-font-weight--normal">
        <i
          className="fas fa-spinner fa-spin vads-u-margin-right--1"
          aria-hidden="true"
        />{' '}
        {loadingMessage}
      </MessageWrapper>
    );
  }

  let successSpan = '';
  let successSpanId = undefined;
  if (successMessage) {
    successSpanId = `${id}-success-message`;
    successSpan = (
      <MessageWrapper id={successSpanId} classes={'rb-input-message-success'}>
        <i
          className="fas fa-check-circle vads-u-margin-right--1"
          aria-hidden="true"
        />{' '}
        <span className="sr-only">Success</span> {successMessage}
      </MessageWrapper>
    );
  }

  // Calculate required.
  const requiredSpan = required ? (
    <span className="form-required-span">(*Required)</span>
  ) : (
    undefined
  );

  const buttonOptions = isArray(options) ? options : [];
  const storedValue = value?.value;
  const optionElements = buttonOptions.map((option, optionIndex) => {
    let optionLabel;
    let optionValue;
    let optionAriaLabel;
    let optionAdditional;
    if (isString(option)) {
      optionLabel = option;
      optionValue = option;
    } else {
      optionLabel = option.label;
      optionValue = option.value;
      optionAriaLabel = option.ariaLabel;
      if (option.additional) {
        optionAdditional = <div>{option.additional}</div>;
      }
    }
    const checked = optionValue === storedValue ? 'checked=true' : '';
    const buttonAriaDescribedby =
      (checked && ariaDescribedby?.[optionIndex]) || null;
    return (
      <div key={optionAdditional ? undefined : optionIndex}>
        <input
          checked={checked}
          id={`${id}-${optionIndex}`}
          name={name}
          type="radio"
          onMouseDown={onMouseDown}
          onKeyDown={onKeyDown}
          value={optionValue}
          onChange={handleChange}
          aria-describedby={buttonAriaDescribedby}
        />

        <label
          name={`${name}-${optionIndex}-label`}
          htmlFor={`${id}-${optionIndex}`}
          aria-label={optionAriaLabel}
          className="vads-u-margin--0 vads-u-padding-y--1p5"
        >
          {optionLabel}
        </label>
        {option.content}
      </div>
    );
  });

  const fieldsetClasses = classNames(
    'rb-fieldset-input',
    'rb-input',
    {
      'rb-input-error': errorMessage,
      'rb-input-warning': warningMessage,
      'rb-input-success': successMessage,
    },
    additionalFieldsetClass,
  );

  const legendClasses = classNames(
    'rb-legend',
    'vads-u-font-weight--bold',
    'vads-u-font-size--base',
    'vads-u-padding--0',
    additionalLegendClass,
  );

  return (
    <fieldset className={fieldsetClasses} disabled={disabled} id={id}>
      <div className="clearfix">
        <legend className={legendClasses}>
          {label}
          {requiredSpan}
        </legend>
      </div>
      {description ? (
        <p className="vads-u-margin-y--0p5 vads-u-color--gray-medium">
          {description}
        </p>
      ) : null}
      {!loadingMessage && !successMessage && !warningMessage && errorSpan}
      {!loadingMessage && !errorMessage && !successMessage && warningSpan}
      {!loadingMessage && !errorMessage && !warningMessage && successSpan}
      {!errorMessage && !successMessage && !warningMessage && loadingSpan}
      {optionElements}
    </fieldset>
  );
};

NotificationRadioButtons.propTypes = {
  /**
   * Additional fieldset classes
   */
  additionalFieldsetClass: PropTypes.string,
  /**
   * Additional legend classes
   */
  additionalLegendClass: PropTypes.string,
  /**
   * Child elements (content)
   */
  children: PropTypes.node,
  /**
   * Radio button group error message
   */
  errorMessage: PropTypes.string,
  /**
   * Radio button group warning message
   */
  warningMessage: PropTypes.string,
  /**
   * Radio button group success message
   */
  successMessage: PropTypes.string,
  /**
   * Radio button group field label
   */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  /**
   * Name attribute
   */
  name: PropTypes.string,
  id: PropTypes.string,
  /**
   * Mouse Down handler
   */
  onMouseDown: PropTypes.func,
  /**
   * Key Down handler
   */
  onKeyDown: PropTypes.func,
  /**
   * Array of options to populate group. Each item is a string or an object
   * representing an Expanding Group.
   *
   * If the option is an object, it takes the following shape:
   *
   * `option.label` `<string|element>` - The text to display for the option
   *
   * `option.value` `<string|bool> - `The value of the option when selected
   */
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
          .isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])
          .isRequired,
      }),
    ]),
  ).isRequired,
  /**
   * Value object for selected field
   *
   * `value`: string value that matches radio button value
   *
   * `dirty`: indicates if form is dirty; should be true after any user input
   */
  value: PropTypes.shape({
    /**
     * Value of the select field.
     */
    value: PropTypes.string,
    dirty: PropTypes.bool,
  }).isRequired,
  /**
   * Handler for the value change
   */
  onValueChange: PropTypes.func.isRequired,
  /**
   * Toggles required field indicator
   */
  required: PropTypes.bool,
  /**
   * aria-describedby labels array based on the option index
   */
  ariaDescribedby: PropTypes.arrayOf(PropTypes.string),
};

export default NotificationRadioButtons;
