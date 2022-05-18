import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { handleScrollOnInputFocus } from '../utils/helpers';

const Dropdown = ({
  alt,
  ariaLabel,
  className,
  disabled,
  hideArrows,
  label,
  name,
  options,
  onChange,
  onFocus,
  selectClassName,
  value,
  visible,
  // optionDisabled,
}) => {
  if (!visible) {
    return null;
  }

  const dropdownId = `${name}-dropdown`;
  const labelElement = <label htmlFor={name}>{label}</label>;

  const selectClasses = classNames('vads-u-color--gray', selectClassName, {
    hideArrows,
  });

  return (
    <div className={classNames(className, { disabled })} id={dropdownId}>
      {label && labelElement}
      <select
        aria-label={ariaLabel}
        className={selectClasses}
        id={name}
        name={name}
        alt={alt}
        value={value}
        onChange={onChange}
        disabled={disabled}
        onFocus={() => onFocus(dropdownId)}
      >
        {options.map(
          ({ optionValue, optionLabel, optionDisabled }, index) =>
            optionLabel && (
              <option
                key={index}
                value={optionValue}
                disabled={optionDisabled}
                className={
                  optionValue === value
                    ? 'vads-u-font-weight--bold'
                    : 'vads-u-font-weight--normal'
                }
              >
                {optionLabel}
              </option>
            ),
        )}
      </select>
    </div>
  );
};

Dropdown.propTypes = {
  alt: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  onFocus: PropTypes.func,
};

Dropdown.defaultProps = {
  className: 'form-group top-aligned',
  visible: false,
  onFocus: handleScrollOnInputFocus,
};

export default Dropdown;
