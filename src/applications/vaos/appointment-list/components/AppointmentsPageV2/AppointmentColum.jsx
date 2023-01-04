// import React from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function getClasses({ className, first, last, padding, size }) {
  const defaultClassNames = classNames(
    `vads-u-flex--${size}`,
    `vads-u-padding-top--${padding} || 0p25`,
    {
      'vads-u-margin-left--1': first,
      'vads-u-margin-right--1': last,
      'vads-u-text-align--right': last,
      'vaos-hide-for-print': last,
    },
  );

  // Append class names
  if (className) {
    return `${defaultClassNames} ${className}`;
  }

  // Default class names
  return defaultClassNames;
}

export default function AppointmentColumn({
  canceled,
  children,
  className,
  first,
  icon,
  last,
  padding,
  size,
  style,
  ...props
}) {
  const defaultStyles = {
    canceled: {
      textDecoration: canceled ? 'line-through' : 'none',
    },
  };

  return (
    <div
      className={getClasses({ className, first, padding, last, size })}
      style={{ ...defaultStyles.canceled, ...style }}
      {...props}
    >
      {icon && (
        <i
          aria-hidden="true"
          className={classNames('fas', 'vads-u-margin-right--1', icon)}
        />
      )}

      {children}
    </div>
  );
}

AppointmentColumn.propTypes = {
  /** Add strikethough for canceled appointments */
  canceled: PropTypes.bool,

  /** Anything that can be rendered */
  children: PropTypes.node,

  /** CSS classes to be appended to the default */
  className: PropTypes.string,

  /** Is this the 1st appointment */
  first: PropTypes.bool,

  /** Icon to add to the column */
  icon: PropTypes.string,

  /** Is this the last appointment */
  last: PropTypes.bool,

  /** Override the default top padding */
  padding: PropTypes.string,

  /** Override the default column size */
  size: PropTypes.string,

  /** CSS styles to be appened to the default */
  style: PropTypes.object,
};
