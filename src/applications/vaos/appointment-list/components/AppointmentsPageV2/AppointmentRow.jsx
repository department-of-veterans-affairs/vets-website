import React from 'react';
import PropTypes from 'prop-types';

export default function AppointmentRow({
  children,
  className,
  id,
  style,
  ...props
}) {
  return (
    <div
      id={id}
      className={`vads-u-display--flex vads-u-flex-direction--column ${className}`}
      style={{ ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

AppointmentRow.propTypes = {
  /** Anything that can be rendered */
  children: PropTypes.node,

  /** Additional classes to add to the row */
  className: PropTypes.string,

  /** Row id */
  id: PropTypes.string,

  /** Additional styles to add to the row */
  style: PropTypes.string,
};
