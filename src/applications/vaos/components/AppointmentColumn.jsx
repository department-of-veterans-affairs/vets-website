import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function getClasses({ className, first, last, padding, size }) {
  // Append class names
  if (className) {
    const names = classNames(
      `vads-u-flex--${size}`,
      `vads-u-padding-top--${padding || '0'}`,
      {
        'vads-u-margin-left--1': first,
        'vads-u-margin-right--1': last,
        'vads-u-text-align--right': last,
        'vaos-hide-for-print': last,
      },
    );
    return `${names} ${className}`;
  }

  // Default class names
  return classNames(
    `vads-u-flex--${size}`,
    `vads-u-padding-top--${padding || '0'}`,
    {
      'vads-u-margin-left--1': first,
      'vads-u-margin-right--1': last,
      'vads-u-text-align--right': last,
      'vaos-hide-for-print': last,
    },
  );
}

export default function AppointmentColumn({
  canceled,
  children,
  className,
  first,
  last,
  padding,
  size = 1,
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
      role="cell"
    >
      {children}
    </div>
  );
}

AppointmentColumn.propTypes = {
  /** Add strikethrough text style if set */
  canceled: PropTypes.bool,

  /** Anything that can be rendered */
  children: PropTypes.node,

  /** Additional classes to add to the column */
  className: PropTypes.string,

  /** First appointment flag */
  first: PropTypes.bool,

  /** Last appointment flag */
  last: PropTypes.bool,

  /** Padding to add to the top of the column */
  padding: PropTypes.string,

  /** Size of flex column */
  size: PropTypes.string,

  /** Additional styles to add to the column */
  style: PropTypes.object,
};
