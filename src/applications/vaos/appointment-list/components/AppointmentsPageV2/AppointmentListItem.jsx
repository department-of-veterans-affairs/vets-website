import React from 'react';
import PropTypes from 'prop-types';

export default function AppointmentListItem({
  appointment,
  children,
  className,
}) {
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

  return (
    <>
      <li
        id={idClickable}
        className={className}
        data-request-id={appointment.id}
        data-cy="appointment-list-item"
      >
        {children}
      </li>
    </>
  );
}

AppointmentListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  children: PropTypes.object,
  className: PropTypes.string,
};
