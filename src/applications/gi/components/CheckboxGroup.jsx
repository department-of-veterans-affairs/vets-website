import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

/**
 * A radio button group with a label.
 *
 * `label` - String for the group field label.
 * `name` - String for the name attribute.
 * `toolTipText` - String with help text for user.
 * `tabIndex` - Number for keyboard tab order.
 * `options` - Array of options to populate group.
 * `required` - is this field required.
 * `value` - string. Value of the select field.
 * `onValueChange` - a function with this prototype: (newValue)
 */
class CheckboxGroup extends React.Component {
  // eslint-disable-next-line
  UNSAFE_componentWillMount() {
    this.inputId = _.uniqueId('checkbox-group-');
  }

  handleChange = domEvent => {
    this.props.onChange(domEvent);
  };

  renderOptions = () => {
    const options = _.isArray(this.props.options) ? this.props.options : [];
    const optionElements = options.map((option, index) => {
      const { checked, label, name } = option;
      return (
        <div key={index} className="form-checkbox">
          <input
            checked={checked}
            id={`${this.inputId}-${index}`}
            name={name}
            type="checkbox"
            onChange={this.props.onChange}
            aria-labelledby={`${this.inputId}-legend ${
              this.props.name
            }-${index}-label`}
          />
          <label
            id={`${this.props.name}-${index}-label`}
            name={`${name}-label`}
            htmlFor={`${this.inputId}-${index}`}
          >
            {label}
          </label>
        </div>
      );
    });

    return optionElements;
  };

  render() {
    return (
      <div className={this.props.errorMessage ? 'usa-input-error' : ''}>
        <fieldset>
          <div>
            <legend id={`${this.inputId}-legend`} className="gibct-legend">
              {this.props.label}
            </legend>
            {this.renderOptions()}
          </div>
        </fieldset>
      </div>
    );
  }
}

CheckboxGroup.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        additional: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
      }),
    ]),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export default CheckboxGroup;
