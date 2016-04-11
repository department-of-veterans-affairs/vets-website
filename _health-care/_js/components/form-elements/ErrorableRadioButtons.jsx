import React from 'react';
import _ from 'lodash';

/**
 * A radio button group with a label.
 *
 * Validation has the following props.

 * `label` - String for the group field label.
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
    this.props.onValueChange(domEvent.target.value);
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

    // Calculate required.
    let requiredSpan = '';
    if (this.props.required) {
      requiredSpan = <span className="usa-additional_text">Required</span>;
    }

    const options = _.isArray(this.props.options) ? this.props.options : [];
    const storedValue = this.props.value;
    let reactKey = 0;
    const optionElements = options.map((obj) => {
      let optionLabel;
      let optionValue;
      if (_.isString(obj)) {
        optionLabel = obj;
        optionValue = obj;
      } else {
        optionLabel = obj.label;
        optionValue = obj.value;
      }
      const checked = storedValue !== undefined && optionValue === storedValue ? 'checked=true' : '';
      return (
        <div key={reactKey++} className="radio-buttons-inline">
          <input
              checked={checked}
              id={optionValue}
              name={this.inputId}
              type="radio"
              value={optionValue}
              onChange={this.handleChange}/>
          <label htmlFor={optionValue}>
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
      </div>
    );
  }
}

ErrorableRadioButtons.propTypes = {
  errorMessage: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
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
  value: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.bool
  ]).isRequired,
  onValueChange: React.PropTypes.func.isRequired,
  required: React.PropTypes.bool,
};

export default ErrorableRadioButtons;
