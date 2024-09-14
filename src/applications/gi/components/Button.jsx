import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  className,
  ariaSelected,
  dataTestId,
  role,
  onClick,
  children,
  type,
  ariaDescribedBy,
  disabled = false,
  id,
  ariaExpanded,
  ariaControls,
}) => {
  return (
    /* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */
    <button
      {...type && { type }}
      id={id}
      disabled={disabled}
      className={className}
      aria-selected={ariaSelected}
      aria-describedby={ariaDescribedBy}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      data-testid={dataTestId}
      role={role}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  ariaDescribedBy: PropTypes.string,
  ariaExpanded: PropTypes.any,
  ariaSelected: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  role: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
