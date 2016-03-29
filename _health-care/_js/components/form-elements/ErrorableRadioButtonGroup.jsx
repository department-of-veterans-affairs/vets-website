import React from 'react';
import _ from 'lodash';

/**
 * A form radio button group with a label that can display error messages.
 *
 * Validation has the following props.
 * `errorMessage` - Error string to display in the component.
 *                  When defined, indicates group has a validation error.
 * `label` - String for the group field label.
 * `options` - Array of options to populate group.
 * `required` - boolean. Render marker indicating field is required.
 * `value` - string. Value of the select field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class ErrorableRadioButtonGroup extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.inputId = _.uniqueId('errorable-radio-button-group-');
  }

  handleChange(domEvent) {
    this.props.onValueChange(domEvent.target.checked);
  }

  render() {
    const options = _.isArray(this.props.choices) ? this.props.choices : [];
    let reactKey = 0;
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
      const checked = value === this.props.value ? 'checked=true' : '';
      return (
        <div key={reactKey++}>
          <input
              type="radio"
              checked={checked}
              name={this.inputId}
              value={value}
              onChange={this.handleChange}/>
          <label>
            {label}
          </label>
        </div>
      );
    });

    return (
      <div>
        <label htmlFor={this.inputId}>{this.props.label}</label>
        {optionElements}
      </div>
    );
  }
}

ErrorableRadioButtonGroup.propTypes = {
  // errorMessage: React.PropTypes.string,
  label: React.PropTypes.string.isRequired,
  options: React.PropTypes.arrayOf(
    React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.shape({
        label: React.PropTypes.string,
        value: React.PropTypes.string }),
    ])).isRequired,
  required: React.PropTypes.bool,
  value: React.PropTypes.string,
  onValueChange: React.PropTypes.func.isRequired,
};

export default ErrorableRadioButtonGroup;
