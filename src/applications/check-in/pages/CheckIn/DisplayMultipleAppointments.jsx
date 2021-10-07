import React from 'react';
import format from 'date-fns/format';

import AppointmentListItem from '../../components/AppointmentDisplay/AppointmentListItem';
import BackButton from '../../components/BackButton';
import BackToHome from '../../components/BackToHome';
import Footer from '../../components/Footer';
import recordEvent from 'platform/monitoring/record-event';
import { createAnalyticsSlug } from '../../utils/analytics';
import { sortAppointmentsByStartTime } from '../../utils/appointment';

export default function DisplayMultipleAppointments(props) {
  const {
    appointments,
    getMultipleAppointments,
    isUpdatePageEnabled,
    router,
    token,
  } = props;

  const handleClick = e => {
    e.preventDefault();

    recordEvent({
      event: createAnalyticsSlug('refresh-appointments-button-clicked'),
    });

    getMultipleAppointments();
  };

  const sortedAppointments = sortAppointmentsByStartTime(appointments);
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 appointment-check-in">
      {isUpdatePageEnabled && <BackButton router={router} />}
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
      <p data-testid="update-text">
        <strong>Latest update:</strong>{' '}
        {format(new Date(), 'MMMM dd, yyyy HH:mm')}
      </p>
      <p data-testid="refresh-link">
        <a
          onClick={e => handleClick(e)}
          href="#"
          data-testid="refresh-appointments-button"
        >
          Refresh
        </a>
      </p>
      <Footer />
      <BackToHome />
    </div>
  );
}
