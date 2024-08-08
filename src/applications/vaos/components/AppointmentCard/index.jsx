import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AppointmentCardIcon from './AppointmentCardIcon';
import { selectFeatureAppointmentDetailsRedesign } from '../../redux/selectors';

export default function AppointmentCard({ children, appointment }) {
  const featureAppointmentDetailsRedesign = useSelector(state =>
    selectFeatureAppointmentDetailsRedesign(state),
  );

  return (
    <>
      {featureAppointmentDetailsRedesign && (
        <div
          className="vaos-appts__appointment-details--container vads-u-margin-top--4 vads-u-border--2px vads-u-border-color--gray-medium vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3"
          data-testid="appointment-card"
        >
          <AppointmentCardIcon appointment={appointment} />

          {children}
        </div>
      )}

      {!featureAppointmentDetailsRedesign && children}
    </>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object.isRequired,
  children: PropTypes.node,
};
