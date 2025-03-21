import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { handleScrollOnInputFocus } from '../utils/helpers';

const Dropdown = forwardRef(
  (
    {
      alt,
      ariaLabel,
      boldLabel,
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
      required,
      children,
    },
    ref,
  ) => {
    if (!visible) {
      return null;
    }

    const dropdownId = `${name}-dropdown`;
    const labelElement = boldLabel ? (
      <strong>
        <label htmlFor={name}>
          {label}{' '}
          {required ? (
            <span className="required-label">(*Required)</span>
          ) : null}{' '}
          {children}
        </label>
      </strong>
    ) : (
      <label htmlFor={name}>
        {label}{' '}
        {required ? <span className="required-label">(*Required)</span> : null}{' '}
        {children}
      </label>
    );

    const selectClasses = classNames('vads-u-color--gray', selectClassName, {
      hideArrows,
    });

    return (
      <div className={classNames(className, { disabled })} id={dropdownId}>
        {label && labelElement}
        <select
          ref={ref}
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
  },
);

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
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hideArrows: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  selectClassName: PropTypes.string,
  visible: PropTypes.bool,
  onFocus: PropTypes.func,
  required: PropTypes.bool,
  boldLabel: PropTypes.bool,
  children: PropTypes.node,
};

Dropdown.defaultProps = {
  className: 'form-group top-aligned',
  visible: false,
  onFocus: handleScrollOnInputFocus,
  required: false,
};

export default Dropdown;
