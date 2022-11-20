import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { selectFeatureAppointmentList } from '../../../redux/selectors';

export default function AppointmentListItem({
  appointment,
  borderBottom,
  borderTop,
  children,
}) {
  const isMobile = useMediaQuery({ query: '(max-width: 360px)' });
  const featureAppointmentList = useSelector(state =>
    selectFeatureAppointmentList(state),
  );

  const idClickable = `id-${appointment.id.replace('.', '\\.')}`;

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
          'vads-u-border-top--1px':
            (featureAppointmentList && isMobile) ||
            (featureAppointmentList && borderTop),
          'vads-u-border-bottom--1px': featureAppointmentList && borderBottom,
        })}
      >
        {children}
      </li>
    </>
  );
}

AppointmentListItem.propTypes = {
  appointment: PropTypes.object.isRequired,
  borderBottom: PropTypes.bool,
  borderTop: PropTypes.bool,
  children: PropTypes.object,
};
