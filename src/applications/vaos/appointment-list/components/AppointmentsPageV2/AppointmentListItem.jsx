import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function AppointmentListItem({ children, className, id }) {
  return (
    <li
      id={`id-${id.replace('.', '\\.')}`}
      className={classNames(`vaos-appts__listItem--lineHeight`, `${className}`)}
      data-request-id={id}
      data-cy="appointment-list-item"
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
