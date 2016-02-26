import React from 'react';
import _ from 'lodash';

/**
 * An text input field that can regexp validate an input.
 *
 * Validation has the following props.
 * `errorMessage` - Error string to display in the component.
 *                  When defined, indicates input has a validation error.
 * `placeholder` - placeholder string for input field.
 * `required` - boolean. Render marker indicating field is required.
 * `value` - string. Value of the input field.
 * `onValueChange` - a function with this prototype: (newValue, isValid)
 */
class ErrorableInput extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('validated-input-');
  }

  handleChange(domEvent) {
    this.props.onValueChange(domEvent.target.value);
  }

  render() {
    // Calculate error state.
    let errorSpan = '';
    let errorSpanId = undefined;
    let errorClass = '';
    if (this.props.errorMessage) {
      errorClass = 'usa-input-error';
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = <span id={`${this.inputId}-error-message`}>{this.props.errorMessage}</span>;
    }

    // Calculate required.
    let requiredSpan = '';
    if (this.props.required) {
      requiredSpan = <span className="usa-additional_text">Required</span>;
    }

    return (
      <div className={`usa-input-grid usa-input-grid-medium ${errorClass}`}>
          <label className={`${errorClass}-label`} htmlFor={this.inputId}>
            {this.props.label}
            {requiredSpan}
          </label>
          {errorSpan}
        <input
            aria-describedby={errorSpanId}
            className={errorClass}
            id={this.inputId}
            placeholder={this.props.placeholder}
            type="text"
            value={this.props.value}
            onChange={this.handleChange}/>
      </div>
    );
  }
}

ErrorableInput.propTypes = {
  errorMessage: React.PropTypes.string,
  label: React.PropTypes.string,
  placeholder: React.PropTypes.string,
  required: React.PropTypes.bool,
  value: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired,
};


export default ErrorableInput;
