import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { makeField } from '~/platform/forms/fields';

/**
 * A radio button group with a label.
 *
 * Validation has the following props.
 *
 * - `additionalFieldsetClass` String for any additional fieldset classes.
 * - `additionalLegendClass` String for any additional legend classes.
 * - `errorMessage` String Error message for the radio button group
 * - `warningMessage` String Warning message for the radio button group
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
  id = _.uniqueId('notification-radio-buttons-'),
  additionalFieldsetClass,
  additionalLegendClass,
  errorMessage,
  warningMessage,
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
      <span className="rb-input-error-message" role="alert" id={errorSpanId}>
        <i className="fas fa-exclamation-circle vads-u-margin-x--1" />{' '}
        <span className="sr-only">Error</span> {errorMessage}
      </span>
    );
  }

  let warningSpan = '';
  let warningSpanId = undefined;
  if (warningMessage) {
    warningSpanId = `${id}-warning-message`;
    warningSpan = (
      <span
        className="rb-input-warning-message"
        role="alert"
        id={warningSpanId}
      >
        <i className="fas fa-exclamation-triangle vads-u-margin-x--1" />{' '}
        <span className="sr-only">Warning</span> {warningMessage}
      </span>
    );
  }

  let successSpan = '';
  let successSpanId = undefined;
  if (successMessage) {
    successSpanId = `${id}-success-message`;
    successSpan = (
      <span
        className="rb-input-success-message"
        role="alert"
        id={successSpanId}
      >
        <i className="fas fa-check-circle vads-u-margin-x--1" />{' '}
        <span className="sr-only">Success</span> {successMessage}
      </span>
    );
  }

  // Calculate required.
  let requiredSpan = undefined;
  if (required) {
    requiredSpan = <span className="form-required-span">(*Required)</span>;
  }

  const buttonOptions = _.isArray(options) ? options : [];
  const storedValue = value?.value;
  const optionElements = buttonOptions.map((option, optionIndex) => {
    let optionLabel;
    let optionValue;
    let optionAdditional;
    if (_.isString(option)) {
      optionLabel = option;
      optionValue = option;
    } else {
      optionLabel = option.label;
      optionValue = option.value;
      if (option.additional) {
        optionAdditional = <div>{option.additional}</div>;
      }
    }
    const checked = optionValue === storedValue ? 'checked=true' : '';
    const buttonAriaDescribedby =
      (checked && ariaDescribedby?.[optionIndex]) || null;
    return (
      <div
        key={optionAdditional ? undefined : optionIndex}
        className="form-radio-buttons"
      >
        <div className="errorable-radio-button rb-buttons">
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
          >
            {optionLabel}
          </label>
          {option.content}
        </div>
      </div>
    );
  });

  const fieldsetClass = classNames('rb-fieldset-input', {
    'rb-input-error': errorMessage,
    'rb-input-warning': warningMessage,
    'rb-input-success': successMessage,
    [additionalFieldsetClass]: additionalFieldsetClass,
  });

  const legendClass = classNames('rb-input-notify-label', {
    [additionalLegendClass]: additionalLegendClass,
  });

  return (
    <fieldset className={fieldsetClass}>
      <span className={legendClass}>
        {label}
        {requiredSpan}
      </span>
      {errorSpan}
      {warningSpan}
      {successSpan}
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
