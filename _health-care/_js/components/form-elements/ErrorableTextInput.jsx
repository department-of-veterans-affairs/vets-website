import React from 'react';
import _ from 'lodash';

/**
 * A form input with a label that can display error messages.
 *
 * Validation has the following props.
 * `errorMessage` - Error string to display in the component.
 *                  When defined, indicates input has a validation error.
 * `label` - String for the input field label.
 * `placeholder` - placeholder string for input field.
 * `required` - boolean. Render marker indicating field is required.
 * `value` - string. Value of the input field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ErrorableTextInput extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('errorable-input-');
  }

  handleChange(domEvent) {
    this.props.onValueChange(domEvent.target.value);
  }

  render() {
    // Calculate error state.
    let errorSpan = '';
    let errorSpanId = undefined;
    if (this.props.errorMessage) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{this.props.errorMessage}</span>;
    }

    // Calculate required.
    let requiredSpan = '';
    if (this.props.required) {
      requiredSpan = <span className="usa-additional_text">Required</span>;
    }

    return (
      <div className={`${this.props.errorMessage ? 'usa-input-error' : ''}`}>
        <label
            className={this.props.errorMessage ? 'usa-input-error-label' : undefined}
            htmlFor={this.inputId}>
              {this.props.label}
              {requiredSpan}
        </label>
        {errorSpan}
        <input
            aria-describedby={errorSpanId}
            id={this.inputId}
            placeholder={this.props.placeholder}
            type="text"
            value={this.props.value}
            onChange={this.handleChange}/>
      </div>
    );
  }
}

ErrorableTextInput.propTypes = {
  errorMessage: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool,
  value: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired,
};

export default ErrorableTextInput;
