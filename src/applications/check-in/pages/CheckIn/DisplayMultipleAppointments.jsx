import React from 'react';
import format from 'date-fns/format';

import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import AppointmentListItem from '../../components/AppointmentDisplay/AppointmentListItem';
import { sortAppointmentsByStartTime } from '../../utils/appointment';

export default function DisplayMultipleAppointments(props) {
  const {
    isDemographicsPageEnabled,
    isUpdatePageEnabled,
    token,
    appointments,
    router,
  } = props;

  const sortedAppointments = sortAppointmentsByStartTime(appointments);
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 appointment-check-in">
      {(isUpdatePageEnabled || isDemographicsPageEnabled) && (
        <BackButton router={router} />
      )}
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Your appointments
      </h1>
      <p data-testid="date-text">
        Here are your appointments for today:{' '}
        {format(new Date(), 'MMMM dd, yyyy')}.
      </p>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ol
        className="appointment-list vads-u-padding--0 vads-u-margin--0 vads-u-margin-bottom--2"
        role="list"
      >
        {sortedAppointments.map((appointment, index) => {
          return (
            <AppointmentListItem
              appointment={appointment}
              key={index}
              router={router}
              token={token}
            />
          );
        })}
      </ol>
      <Footer />
      <BackToHome />
    </div>
  );
}
