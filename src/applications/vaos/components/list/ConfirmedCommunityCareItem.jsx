import React from 'react';
import classNames from 'classnames';
import { formatAppointmentDate } from '../../utils/appointment';
import AddToCalendar from '../AddToCalendar';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import AppointmentDateTime from './AppointmentDateTime';
import Instructions from './Instructions';
import Status from './Status';

export default function ConfirmedCommunityCareItem({
  appointment,
  index,
  cancelAppointment,
  showCancelButton,
}) {
  const itemClasses = classNames(
    'vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
    {
      'vads-u-border-top--4px': !appointment.isPastAppointment,
      'vads-u-border-color--green': !appointment.isPastAppointment,
    },
  );
  const appointmentAddress = `${appointment.address.street} ${
    appointment.address.city
  }, ${appointment.address.state} ${appointment.address.zipCode}`;

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-state`}
      className={itemClasses}
    >
      <div
        id={`card-${index}-type`}
        className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        Community Care
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        <AppointmentDateTime appointment={appointment} />
      </h3>
      {!appointment.isPastAppointment && (
        <Status status={appointment.status} index={index} />
      )}

      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
          <dl className="vads-u-margin--0">
            <dt className="vads-u-font-weight--bold">
              {appointment.providerPractice}
            </dt>
            <dd>
              {appointment.address.street}
              <br />
              {appointment.address.city}, {appointment.address.state}{' '}
              {appointment.address.zipCode}
              <br />
              <FacilityDirectionsLink location={appointment} />
            </dd>
          </dl>
        </div>
        {!appointment.isPastAppointment && (
          <Instructions instructions={appointment.instructions} />
        )}
      </div>

      {!appointment.isPastAppointment && (
        <div className="vads-u-margin-top--2">
          <AddToCalendar
            summary="Community Care"
            description={
              appointment.instructions
                ? `${appointment.instructions.header}. ${
                    appointment.instructions.body
                  }`
                : ''
            }
            location={appointmentAddress}
            duration={appointment.duration}
            startDateTime={appointment.appointmentDate.toDate()}
            endDateTime={appointment.appointmentDate}
          />
          {showCancelButton && (
            <button
              onClick={() => cancelAppointment(appointment)}
              aria-label="Cancel appointment"
              className="vaos-appts__cancel-btn va-button-link vads-u-margin--0 vads-u-flex--0"
            >
              Cancel appointment
              <span className="sr-only">
                {' '}
                on {formatAppointmentDate(appointment.appointmentDate)}
              </span>
            </button>
          )}
        </div>
      )}
    </li>
  );
}
