// import React from 'react';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function getClasses({ classNameOverride, className, first, last }) {
  // TODO: Check type == String
  if (classNameOverride) {
    return `vads-u-padding-top--0p25 ${classNameOverride}`;
  }

  // Append class names
  if (className) {
    const names = classNames('vads-l-col', 'vads-u-padding-top--0p25', {
      'vads-u-margin-left--1': first,
      'vads-u-margin-right--1': last,
      'vads-u-text-align--right': last,
      'vaos-hide-for-print': last,
    });
    return `${names} ${className}`;
  }

  // Default class names
  return classNames('vads-l-col', 'vads-u-padding-top--0p25', {
    'vads-u-margin-left--1': first,
    'vads-u-margin-right--1': last,
    'vads-u-text-align--right': last,
    'vaos-hide-for-print': last,
  });
}

export default function AppointmentColumn({
  children,
  first,
  canceled,
  className,
  classNameOverride,
  id,
  last,
  icon,
  style,
}) {
  const defaultStyles = {
    canceled: {
      textDecoration: canceled ? 'line-through' : 'none',
    },
  };

  if (classNameOverride) {
    return (
      <div
        id={id}
        className={classNameOverride}
        style={{ ...defaultStyles.canceled, ...style }}
      >
        {children}
      </div>
    );
  }

  // return render({ appointmentType, isMobile });
  return (
    <div
      className={getClasses({ classNameOverride, className, first, last })}
      style={defaultStyles.canceled}
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
  canceled: PropTypes.bool,

  /** Anything that can be rendered */
  children: PropTypes.node,

  className: PropTypes.string,

  /** Override default column css styles */
  classNameOverride: PropTypes.string,
  data: PropTypes.string,
  first: PropTypes.bool,
  icon: PropTypes.string,
  id: PropTypes.string,
  isMobile: PropTypes.bool,
  last: PropTypes.bool,
  render: PropTypes.func,
  style: PropTypes.object,
};
