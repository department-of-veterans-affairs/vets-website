import React from 'react';
import PropTypes from 'prop-types';

export default function AppointmentListItem({
  appointment,
  children,
  className,
}) {
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

  return (
    <li
      id={idClickable}
      data-request-id={appointment.id}
      data-cy="appointment-list-item"
      className={className}
    >
      {children}
    </li>
  );
}

AppointmentListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  children: PropTypes.object,
  className: PropTypes.string,
};
