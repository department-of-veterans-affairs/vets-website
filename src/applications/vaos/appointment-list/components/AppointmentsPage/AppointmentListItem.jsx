import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function AppointmentListItem({
  children,
  className,
  id,
  ...props
}) {
  return (
    <li
      id={`id-${id.replace('.', '\\.')}`}
      className={classNames(`vaos-appts__listItem--lineHeight`, `${className}`)}
      data-request-id={id}
      data-testid="appointment-list-item"
      {...props}
    >
      {children}
    </li>
  );
}

AppointmentListItem.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};
