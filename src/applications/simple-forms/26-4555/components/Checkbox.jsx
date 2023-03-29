import PropTypes from 'prop-types';
import React from 'react';
import { uniqueId } from './helpers/utilities';

import dispatchAnalyticsEvent from './helpers/analytics';

class Checkbox extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  UNSAFE_componentWillMount() {
    this.inputId = uniqueId('errorable-checkbox-');
  }

  handleChange(domEvent) {
    const isChecked = domEvent.target.checked;

    if (isChecked && this.props.enableAnalytics) {
      dispatchAnalyticsEvent({
        componentName: 'Checkbox',
        action: 'change',
        details: {
          label: this.props.label,
          labelAboveCheckbox: this.props.labelAboveCheckbox,
          required: this.props.required,
        },
      });
    }

    this.props.onValueChange(isChecked);
  }

  render() {
    // TODO: extract error logic into a utility function
    // Calculate error state.
    let errorSpan = '';
    let errorSpanId;
    if (this.props.errorMessage) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = (
        <span className="usa-input-error-message" role="alert" id={errorSpanId}>
          <span className="sr-only">Error: </span> {this.props.errorMessage}
        </span>
      );
    }

    // Calculate required.
    let requiredSpan;
    if (this.props.required) {
      requiredSpan = <span className="form-required-span">(*Required)</span>;
    }

    let className = `form-checkbox${
      this.props.errorMessage ? ' usa-input-error' : ''
    }`;
    if (this.props.className !== undefined) {
      className = `${className} ${this.props.className}`;
    }

    return (
      <div className={className}>
        {this.props.labelAboveCheckbox && (
          <span className="label-above-checkbox">
            {this.props.labelAboveCheckbox}
          </span>
        )}
        {errorSpan}
        <input
          aria-labelledby={this.props.ariaLabelledBy}
          aria-describedby={
            errorSpanId
              ? `${errorSpanId} ${this.props.ariaDescribedBy}`
              : this.props.ariaDescribedBy
          }
          checked={this.props.checked}
          id={this.inputId}
          name={this.props.name}
          type="checkbox"
          onChange={this.handleChange}
        />
        <label
          className={
            this.props.errorMessage ? 'usa-input-error-label' : undefined
          }
          name={`${this.props.name}-label`}
          htmlFor={this.inputId}
        >
          {this.props.label}
          {requiredSpan}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  /**
   * Handler for when the checkbox is changed
   */
  onValueChange: PropTypes.func.isRequired,
  /**
   * ID of HTML-element containing additional screen-reader text to be read
   * in addition to the regular-label text.
   * NOTE: IF there's an error-message, that message-span's ID would override this ID.
   */
  ariaDescribedBy: PropTypes.string,
  /**
   * aria-labelledby attribute [string] (external-heading ID). Either this or label is required.
   */
  /* eslint-disable consistent-return */
  ariaLabelledBy: (props, propName, componentName) => {
    if (!props.label && !props.ariaLabelledBy) {
      return new Error(
        `Either ${propName} or label property is required in ${componentName}, but both are missing.`,
      );
    }

    if (props.ariaLabelledBy && typeof props.ariaLabelledBy !== 'string') {
      return new Error(
        `${componentName}’s ariaLabelledBy property type is invalid -- should be
        string.`,
      );
    }
  },
  /* eslint-enable consistent-return */
  /**
   * If the checkbox is checked or not
   */
  checked: PropTypes.bool,
  /**
   * Optionally adds one or more CSS classes to the NAV element
   */
  className: PropTypes.string,
  /**
   * Analytics tracking function(s) will be called. Form components
   * are disabled by default due to PII/PHI concerns.
   */
  enableAnalytics: PropTypes.bool,
  /**
   * Error message for the modal
   */
  errorMessage: PropTypes.string,
  /**
   * Label [string or object] for the checkbox. Either this or ariaLabelledBy is required.
   */
  /* eslint-disable consistent-return */
  label: (props, propName, componentName) => {
    const validTypes = ['string', 'object'];

    if (!props.label && !props.ariaLabelledBy) {
      return new Error(
        `Either ${propName} or ariaLabelledBy property is required in ${componentName}, but both are missing.`,
      );
    }

    if (props.label && !validTypes.includes(typeof props.label)) {
      return new Error(
        `${componentName}’s label property type is invalid -- should be one of
        these types: ${validTypes.join(', ')}.`,
      );
    }
  },
  /* eslint-enable consistent-return */
  /**
   * Descriptive text to sit above the checkbox and label
   */
  labelAboveCheckbox: PropTypes.string,
  /**
   * Name for the modal
   */
  name: PropTypes.string,
  /**
   * If the checkbox is required or not
   */
  required: PropTypes.bool,
};

export default Checkbox;
