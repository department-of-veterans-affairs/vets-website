import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import ToolTip from './ToolTip';

import { makeField } from '../../../../platform/forms/fields.js';

/**
 * A form input with a label that can display error messages.
 *
 * Props:
 * `errorMessage` - Error string to display in the component.
 *                  When defined, indicates input has a validation error.
 * `label` - String for the input field label.
 * `name` - String for the input name attribute.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `placeholder` - placeholder string for input field.
 * `required` - boolean. Render marker indicating field is required.
 * `field` - string. Value of the input field.
 * `additionalClass` - Extra attribute for use by CSS selector, specifically
 *                     by tests
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ErrorableTextarea extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('errorable-textarea-');
  }

  handleChange(domEvent) {
    const val = domEvent.target.value;
    // IE9 doesn’t support max length on textareas
    if (!this.props.charMax || val.length <= this.props.charMax) {
      this.props.onValueChange(makeField(val, this.props.field.dirty));
    }
  }

  handleBlur() {
    this.props.onValueChange(makeField(this.props.field.value, true));
  }

  render() {
    // Calculate error state.
    let errorSpan = '';
    let maxCharacters;
    let errorSpanId = undefined;
    let inputErrorClass = undefined;
    let labelErrorClass = undefined;
    if (this.props.errorMessage) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = (
        <span className="usa-input-error-message" role="alert" id={errorSpanId}>
          <span className="sr-only">Error</span> {this.props.errorMessage}
        </span>
      );
      inputErrorClass = 'usa-input-error';
      labelErrorClass = 'usa-input-error-label';
    }

    // Adds ToolTip if text is provided.
    let toolTip;
    if (this.props.toolTipText) {
      toolTip = (
        <ToolTip
          tabIndex={this.props.tabIndex}
          toolTipText={this.props.toolTipText}/>
      );
    }

    // Calculate max characters and display '(Max. XX characters)' when max is hit.
    if (this.props.field.value) {
      if (this.props.charMax === this.props.field.value.length) {
        maxCharacters = (<small>(Max. {this.props.charMax} characters)</small>);
      }
    }

    // Calculate required.
    let requiredSpan = undefined;
    if (this.props.required) {
      requiredSpan = <span className="hca-required-span">*</span>;
    }

    const classes = classNames(this.props.additionalClass, {
      'input-disabled': this.props.disabled,
    });

    return (
      <div className={inputErrorClass}>
        <label
          id={`${this.inputId}-label`}
          className={labelErrorClass}
          htmlFor={this.inputId}>
          {this.props.label}
          {requiredSpan}
        </label>
        {errorSpan}
        <textarea
          disabled={this.props.disabled}
          className={classes}
          aria-describedby={errorSpanId}
          aria-labelledby={`${this.inputId}-label`}
          id={this.inputId}
          placeholder={this.props.placeholder}
          name={this.props.name}
          tabIndex={this.props.tabIndex}
          maxLength={this.props.charMax}
          value={this.props.field.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}/>
        {maxCharacters}
        {toolTip}
      </div>
    );
  }
}

ErrorableTextarea.propTypes = {
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  field: PropTypes.shape({
    value: PropTypes.string,
    dirty: PropTypes.bool
  }).isRequired,
  additionalClass: PropTypes.string,
  charMax: PropTypes.number,
  onValueChange: PropTypes.func.isRequired,
  toolTipText: PropTypes.string
};

export default ErrorableTextarea;
