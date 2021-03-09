import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { handleScrollOnInputFocus } from '../utils/helpers';

const CheckboxGroup = ({ errorMessage, label, onChange, onFocus, options }) => {
  const inputId = _.uniqueId('checkbox-group-');

  const renderOptions = () => {
    const displayOptions = Array.isArray(options) ? options : [];
    return displayOptions.map((option, index) => {
      const { checked, optionLabel, name, learnMore } = option;
      return (
        <div key={index} className="form-checkbox">
          <input
            checked={checked}
            id={`${inputId}-${index}`}
            name={name}
            type="checkbox"
            onFocus={() => onFocus(`${inputId}-${index}`)}
            onChange={onChange}
            aria-labelledby={`${inputId}-legend ${name}-${index}-label`}
          />
          <label
            className="gi-checkbox-label"
            id={`${name}-${index}-label`}
            name={`${name}-label`}
            htmlFor={`${inputId}-${index}`}
          >
            {optionLabel}
          </label>
          {learnMore}
        </div>
      );
    });
  };

  return (
    <div className={errorMessage ? 'usa-input-error' : ''}>
      <fieldset>
        <div>
          <span id={`${inputId}-legend`} className={'gibct-legend'}>
            {label}
          </span>
          {renderOptions()}
        </div>
      </fieldset>
    </div>
  );
};

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
  onFocus: PropTypes.func,
};

CheckboxGroup.defaultProps = {
  onFocus: handleScrollOnInputFocus,
};

export default CheckboxGroup;
