import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AppointmentCardIcon from './AppointmentCardIcon';
import { selectFeatureCardIcon } from '../../../redux/selectors';

export default function AppointmentCard({ children, appointment }) {
  const featureCardIcon = useSelector(state => selectFeatureCardIcon(state));

  return (
    <>
      {featureCardIcon && (
        <div className="vaos-appts__appointment-details--container vads-u-margin-top--2 vads-u-border--2px vads-u-border-color--gray-lighter vads-u-padding-x--2p5 vads-u-padding-top--5 vads-u-padding-bottom--3">
          <AppointmentCardIcon appointment={appointment} />

          {children}
        </div>
      )}

      {!featureCardIcon && children}
    </>
  );
}

AppointmentCard.propTypes = {
  appointment: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};
