import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

/**
 * A checkbox group with a label.
 *
 * `label` - String for the group field label.
 * `options` - Array of options to populate group.
 * `onChange` - a function with this prototype: (newValue)
 */
class CheckboxGroup extends React.Component {
  constructor(props) {
    super(props);
    this.inputId = _.uniqueId('checkbox-group-');
  }

  handleChange = domEvent => {
    this.props.onChange(domEvent);
  };

  renderOptions = () => {
    const options = Array.isArray(this.props.options) ? this.props.options : [];
    return options.map((option, index) => {
      const { checked, label, name, learnMore } = option;
      return (
        <div key={index} className="form-checkbox">
          <input
            checked={checked}
            id={`${this.inputId}-${index}`}
            name={name}
            type="checkbox"
            onChange={this.props.onChange}
            aria-labelledby={`${this.inputId}-legend ${name}-${index}-label`}
          />
          <label
            className="gi-checkbox-label"
            id={`${name}-${index}-label`}
            name={`${name}-label`}
            htmlFor={`${this.inputId}-${index}`}
          >
            {label}
          </label>
          {learnMore}
        </div>
      );
    });
  };

  render() {
    return (
      <div className={this.props.errorMessage ? 'usa-input-error' : ''}>
        <fieldset>
          <div>
            <span id={`${this.inputId}-legend`} className={'gibct-legend'}>
              {this.props.label}
            </span>
            {this.renderOptions()}
          </div>
        </fieldset>
      </div>
    );
  }
}

CheckboxGroup.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
        checked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
      }),
    ]),
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CheckboxGroup;
