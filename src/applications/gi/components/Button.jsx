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
}) => {
  return (
    /* eslint-disable-next-line @department-of-veterans-affairs/prefer-button-component, react/button-has-type */
    <button
      {...type && { type }}
      className={className}
      aria-selected={ariaSelected}
      ariaDescribedBy={ariaDescribedBy}
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
  ariaSelected: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
  role: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
