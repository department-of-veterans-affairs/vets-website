import React from 'react';
import format from 'date-fns/format';

import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import BackButton from '../../components/BackButton';
import AppointmentListItem from '../../components/AppointmentDisplay/AppointmentListItem';

export default function DisplayMultipleAppointments(props) {
  const {
    isUpdatePageEnabled,
    isLowAuthEnabled,
    token,
    appointments,
    router,
  } = props;
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 appointment-check-in">
      {isUpdatePageEnabled && <BackButton router={router} />}
      <h1 tabIndex="-1" className="vads-u-margin-top--2">
        Your appointments
      </h1>
      <p>
        Here are your appointments for today:{' '}
        {format(new Date(), 'MMMM dd, yyyy')}.
      </p>
      {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
      <ol
        className="appointment-list vads-u-padding--0 vads-u-margin--0 vads-u-margin-bottom--2"
        role="list"
      >
        {appointments.map((appointment, index) => {
          return (
            <AppointmentListItem
              appointment={appointment}
              key={index}
              isLowAuthEnabled={isLowAuthEnabled}
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
