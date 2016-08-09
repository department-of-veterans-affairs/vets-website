import React from 'react';
import _ from 'lodash';

import ToolTip from '../form-elements/ToolTip';


/**
 * A form checkbox with a label that can display error messages.
 *
 * Validation has the following props.
 * `checked` - Boolean. Whether or not the checkbox is checked.
 * `errorMessage` - Error string to display in the component.
 *                  When defined, indicates checkbox has a validation error.
 * `label` - String for the checkbox label.
 * `name` - String for name attribute.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `onValueChange` - a function with this prototype: (newValue)
 * `required` - boolean. Render marker indicating field is required.
 */
class ErrorableCheckbox extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('errorable-checkbox-');
  }

  handleChange(domEvent) {
    this.props.onValueChange(domEvent.target.checked);
  }

  render() {
    // TODO: extract error logic into a utility function
    // Calculate error state.
    let errorSpan = '';
    let errorSpanId = undefined;
    if (this.props.errorMessage) {
      errorSpanId = `${this.inputId}-error-message`;
      errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{this.props.errorMessage}</span>;
    }

    // Addes ToolTip if text is provided.
    let toolTip;
    if (this.props.toolTipText) {
      toolTip = (
        <ToolTip
            tabIndex={this.props.tabIndex}
            toolTipText={this.props.toolTipText}/>
      );
    }

    // Calculate required.
    let requiredSpan = undefined;
    if (this.props.required) {
      requiredSpan = <span className="hca-required-span">*</span>;
    }

    return (
      <div className={`${this.props.errorMessage ? 'usa-input-error' : ''} ${this.props.className}`}>
        <input
            aria-describedby={errorSpanId}
            checked={this.props.checked}
            id={this.inputId}
            name={this.props.name}
            type="checkbox"
            onChange={this.handleChange}/>
        <label
            className={this.props.errorMessage ? 'usa-input-error-label' : undefined}
            htmlFor={this.inputId}>
              {this.props.label}
              {requiredSpan}
        </label>
        {errorSpan}
        {toolTip}
      </div>
    );
  }
}

ErrorableCheckbox.propTypes = {
  checked: React.PropTypes.bool,
  errorMessage: React.PropTypes.string,
  name: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  onValueChange: React.PropTypes.func.isRequired,
  required: React.PropTypes.bool,
};

export default ErrorableCheckbox;
