import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { handleScrollOnInputFocus } from '../utils/helpers';

const Dropdown = ({
  alt,
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
}) => {
  if (!visible) {
    return null;
  }

  const dropdownId = `${name}-dropdown`;
  const labelElement =
    typeof label === 'string' ? (
      <label htmlFor={name}>{label}</label>
    ) : (
      <div className="vads-u-margin-top--3">{label}</div>
    );

  const selectClasses = classNames('vads-u-color--gray', selectClassName, {
    hideArrows,
  });

  return (
    <div className={classNames(className, { disabled })} id={dropdownId}>
      {label && labelElement}
      <label className="wrap vads-u-margin--0">
        <select
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
            ({ optionValue, optionLabel }) =>
              optionLabel && (
                <option
                  key={optionValue}
                  value={optionValue}
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
      </label>
    </div>
  );
};

Dropdown.propTypes = {
  visible: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  onFocus: PropTypes.func,
};

Dropdown.defaultProps = {
  className: 'form-group top-aligned',
  visible: false,
  onFocus: handleScrollOnInputFocus,
};

export default Dropdown;
