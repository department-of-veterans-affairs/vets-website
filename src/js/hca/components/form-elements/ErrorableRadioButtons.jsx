import React from 'react';
import _ from 'lodash';

import ToolTip from '../form-elements/ToolTip';

import { makeField } from '../../../common/fields.js';

/**
 * A radio button group with a label.
 *
 * Validation has the following props.

 * `label` - String for the group field label.
 * `name` - String for the name attribute.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `options` - Array of options to populate group.
 * `required` - is this field required.
 * `value` - string. Value of the select field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ErrorableRadioButtons extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('errorable-radio-buttons-');
  }

  handleChange(domEvent) {
    this.props.onValueChange(makeField(domEvent.target.value, true));
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

    const options = _.isArray(this.props.options) ? this.props.options : [];
    const storedValue = this.props.value.value;
    let reactKey = 0;
    const optionElements = options.map((obj, index) => {
      let optionLabel;
      let optionValue;
      if (_.isString(obj)) {
        optionLabel = obj;
        optionValue = obj;
      } else {
        optionLabel = obj.label;
        optionValue = obj.value;
      }
      const checked = optionValue === storedValue ? 'checked=true' : '';
      return (
        <div key={reactKey++} className="hca-radio-buttons">
          <input
              checked={checked}
              id={`${this.inputId}-${index}`}
              name={`${this.props.name}-${index}`}
              type="radio"
              value={optionValue}
              onChange={this.handleChange}/>
          <label htmlFor={`${this.inputId}-${index}`}>
            {optionLabel}
          </label>
        </div>
      );
    });

    return (
      <div className={this.props.errorMessage ? 'usa-input-error' : ''}>
        <label
            className={this.props.errorMessage ? 'usa-input-error-label' : undefined}
            htmlFor={this.inputId}>
            {this.props.label}
            {requiredSpan}
        </label>
        {errorSpan}
        {optionElements}
        {toolTip}
      </div>
    );
  }
}

ErrorableRadioButtons.propTypes = {
  errorMessage: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  name: React.PropTypes.string,
  options: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.oneOfType([
          React.PropTypes.string,
          React.PropTypes.bool
        ])
      })
    ])).isRequired,
  value: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired,
  onValueChange: React.PropTypes.func.isRequired,
  required: React.PropTypes.bool,
};

export default ErrorableRadioButtons;
