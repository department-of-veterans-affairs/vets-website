import React from 'react';
import _ from 'lodash';

import { makeField } from '../../reducers/fields.js';

/**
 * A form select with a label that can display error messages.
 *
 * Validation has the following props.
 * `errorMessage` - Error string to display in the component.
 *                  When defined, indicates select has a validation error.
 * `label` - String for the select field label.
 * `options` - Array of options to populate select.
 * `required` - boolean. Render marker indicating field is required.
 * `value` - string. Value of the select field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ErrorableSelect extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.selectId = _.uniqueId('errorable-select-');
  }

  handleChange(domEvent) {
    this.props.onValueChange(makeField(domEvent.target.value, true));
  }

  render() {
    // Calculate error state.
    let errorSpan = '';
    let errorSpanId = undefined;
    if (this.props.errorMessage) {
      errorSpanId = `${this.selectId}-error-message`;
      errorSpan = <span className="usa-input-error-message" id={`${errorSpanId}`}>{this.props.errorMessage}</span>;
    }

    // Calculate required.
    let requiredSpan = '';
    if (this.props.required) {
      requiredSpan = <span className="usa-additional_text">Required</span>;
    }

    // Calculate options for select
    let reactKey = 0;
    // TODO(awong): Remove this hack to handle options prop and use invariants instead.
    // TODO(crew): Build options with empty option first here instead of in the return jsx block.
    const options = _.isArray(this.props.options) ? this.props.options : [];
    const optionElements = options.map((obj) => {
      let label;
      let value;
      if (_.isString(obj)) {
        label = obj;
        value = obj;
      } else {
        label = obj.label;
        value = obj.value;
      }
      return <option key={++reactKey} value={value}>{label}</option>;
    });

    return (
      <div className={this.props.errorMessage ? 'usa-input-error' : undefined}>
        <label
            className={this.props.errorMessage !== undefined ? 'usa-input-error-label' : undefined}
            htmlFor={this.selectId}>
              {this.props.label}
              {requiredSpan}
        </label>
        {errorSpan}
        <select
            aria-describedby={errorSpanId}
            id={this.selectId}
            value={this.props.value.value}
            onChange={this.handleChange}>
          <option value=""></option>
          {optionElements}
        </select>
      </div>
    );
  }
}

ErrorableSelect.propTypes = {
  errorMessage: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  options: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.string }),
    ])).isRequired,
  required: React.PropTypes.bool,
  value: React.PropTypes.shape({
    value: React.PropTypes.string,
    dirty: React.PropTypes.bool
  }).isRequired,
  onValueChange: React.PropTypes.func.isRequired,
};

export default ErrorableSelect;
