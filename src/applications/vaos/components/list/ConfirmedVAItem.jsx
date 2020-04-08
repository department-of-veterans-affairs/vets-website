import React from 'react';
import classNames from 'classnames';
import {
  formatAppointmentDate,
  getFacilityAddress,
} from '../../utils/appointment';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import VideoVisitSection from './VideoVisitSection';
import AddToCalendar from '../AddToCalendar';
import FacilityAddress from '../FacilityAddress';
import AppointmentDateTime from './AppointmentDateTime';

export default function ConfirmedAppointmentListItem({
  appointment,
  index,
  cancelAppointment,
  showCancelButton,
  facility,
}) {
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const header = appointment.videoType ? 'VA Video Connect' : 'VA Appointment';
  const address = facility ? getFacilityAddress(facility) : null;
  const location = appointment.videoType ? 'Video conference' : address;
  const isPastAppointment = appointment.isPastAppointment;

  const itemClasses = classNames(
    'vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
    {
      'vads-u-border-top--4px': !isPastAppointment,
      'vads-u-border-color--green': !cancelled && !isPastAppointment,
      'vads-u-border-color--secondary-dark': cancelled && !isPastAppointment,
    },
  );

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-state`}
      className={itemClasses}
    >
      <div
        id={`card-${index}-type`}
        className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        {header}
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        <AppointmentDateTime appointment={appointment} />
      </h3>
      {(!isPastAppointment || cancelled) && (
        <div className="vads-u-margin-top--2 vads-u-margin-bottom--2">
          {cancelled ? (
            <i aria-hidden="true" className="fas fa-exclamation-circle" />
          ) : (
            <i aria-hidden="true" className="fas fa-check-circle" />
          )}
          <span
            id={`card-${index}-state`}
            className="vads-u-font-weight--bold vads-u-margin-left--1 vads-u-display--inline-block"
          >
            {cancelled ? 'Canceled' : 'Confirmed'}
          </span>
        </div>
      )}

      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
          {!!appointment.videoType && !isPastAppointment ? (
            <VideoVisitSection appointment={appointment} />
          ) : (
            <dl className="vads-u-margin--0">
              <dt className="vads-u-font-weight--bold">
                {appointment.clinicFriendlyName ||
                  appointment.vdsAppointments[0]?.clinic?.name}
              </dt>
              <dd>
                {!!facility && (
                  <>
                    {facility.name}
                    <br />
                    <FacilityAddress facility={facility} showDirectionsLink />
                  </>
                )}
                {!facility && (
                  <a
                    href="/find-locations"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Find facility information
                  </a>
                )}
              </dd>
            </dl>
          )}
        </div>
        {!!appointment.instructions &&
          !isPastAppointment && (
            <div className="vads-u-flex--1 vads-u-margin-bottom--2 vaos-u-word-break--break-word">
              <dl className="vads-u-margin--0">
                <dt className="vads-u-font-weight--bold">
                  {appointment.instructions.header}
                </dt>
                <dd>{appointment.instructions.body}</dd>
              </dl>
            </div>
          )}
      </div>

      {!cancelled &&
        !isPastAppointment && (
          <div className="vads-u-margin-top--2">
            <AddToCalendar
              summary={header}
              description={
                appointment.instructions
                  ? `${appointment.instructions.header}. ${
                      appointment.instructions.body
                    }`
                  : ''
              }
              location={location}
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
