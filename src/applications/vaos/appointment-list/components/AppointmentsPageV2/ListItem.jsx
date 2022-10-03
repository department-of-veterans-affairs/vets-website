import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { selectFeatureAppointmentList } from '../../../redux/selectors';

export default function ListItem({ appointment, children }) {
  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );

  if (featureAppointmentList)
    return (
      <li
        id={idClickable}
        data-request-id={appointment.id}
        className="vaos-appts__card--clickable"
        style={{ backgroundColor: 'transparent', border: 'none' }}
        data-cy="appointment-list-item"
      >
        {children}
      </li>
    );

  return (
    <li
      id={idClickable}
      data-request-id={appointment.id}
      className="vaos-appts__card--clickable vads-u-margin-bottom--3"
      data-cy="appointment-list-item"
    >
      {children}
    </li>
  );
}

ListItem.propTypes = {
  appointment: PropTypes.object,
  children: PropTypes.array,
};
