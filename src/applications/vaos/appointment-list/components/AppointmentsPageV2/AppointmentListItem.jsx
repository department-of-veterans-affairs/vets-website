import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import { selectFeatureAppointmentList } from '../../../redux/selectors';
import { getUpcomingAppointmentListInfo } from '../../redux/selectors';
import { getVAAppointmentLocationId } from '../../../services/appointment';

export default function AppointmentListItem({
  appointment,
  borderBottom,
  borderTop,
  children,
}) {
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );

  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;
  const { facilityData } = useSelector(
    state => getUpcomingAppointmentListInfo(state),
    shallowEqual,
  );
  const facility = facilityData[getVAAppointmentLocationId(appointment)];

  return (
    <>
      <li
        id={idClickable}
        data-request-id={appointment.id}
        data-cy="appointment-list-item"
        className={classNames({
          'vaos-appts__card--clickable': !featureAppointmentList,
          'vads-u-margin-bottom--3': !featureAppointmentList,
          'vaos-appts__listItem--clickable': featureAppointmentList,
          'vads-u-margin--0': featureAppointmentList,
          'vads-u-border-top--1px': featureAppointmentList && borderTop,
          'vads-u-border-bottom--1px': featureAppointmentList && borderBottom,
        })}
      >
        {children(appointment, facility)}
      </li>
    </>
  );
}

AppointmentListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  borderBottom: PropTypes.bool,
  borderTop: PropTypes.bool,
  children: PropTypes.func,
};
