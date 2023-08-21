import React from 'react';
import PropTypes from 'prop-types';

const getClassName = (button, selected) => {
  const baseClassName = 'usa-button';

  if (button.value !== selected) {
    return `${baseClassName} usa-button--outline`;
  }

  return baseClassName;
};

export default function VaButtonGroupSegmented({
  options = [],
  onOptionClick,
  selected,
}) {
  if (!options.length) return null;

  return (
    <ul className="usa-button-group usa-button-group--segmented">
      {options.map((option, index) => (
        <li key={index} className="usa-button-group__item">
          <button
            type="button"
            className={getClassName(option, selected)}
            onClick={() => onOptionClick(option.value)}
          >
            {option.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

VaButtonGroupSegmented.propTypes = {
  options: PropTypes.array,
  selected: PropTypes.string,
  onOptionClick: PropTypes.func,
};
