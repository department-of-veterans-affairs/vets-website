import React from 'react';
import classNames from 'classnames';
import moment from 'moment';
import { formatFacilityAddress } from '../utils/formatters';
import { APPOINTMENT_STATUS } from '../utils/constants';
import VideoVisitSection from './VideoVisitSection';
import AddToCalendar from './AddToCalendar';
import VAFacilityLocation from './VAFacilityLocation';
import AppointmentDateTime from './AppointmentDateTime';
import AppointmentInstructions from './AppointmentInstructions';
import CommunityCareInstructions from './CommunityCareInstructions';
import AppointmentStatus from './AppointmentStatus';
import ConfirmedCommunityCareLocation from './ConfirmedCommunityCareLocation';

function formatAppointmentDate(date) {
  if (!date.isValid()) {
    return null;
  }

  return date.format('MMMM D, YYYY');
}

export default function ConfirmedAppointmentListItem({
  appointment,
  index,
  cancelAppointment,
  showCancelButton,
  facility,
}) {
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.vaos.isPastAppointment;
  const isCommunityCare = appointment.vaos.isCommunityCare;
  const isInPersonVAAppointment =
    !appointment.vaos.videoType && !isCommunityCare;
  const isVideoAppointment = !!appointment.vaos.videoType;

  const itemClasses = classNames(
    'vads-u-background-color--gray-lightest vads-u-padding--2p5 vads-u-margin-bottom--3',
    {
      'vads-u-border-top--4px': !isPastAppointment,
      'vads-u-border-color--green': !cancelled && !isPastAppointment,
      'vads-u-border-color--secondary-dark': cancelled && !isPastAppointment,
    },
  );

  let header;
  let location;
  if (isVideoAppointment) {
    header = 'VA Video Connect';
    location = 'Video conference';
  } else if (isCommunityCare) {
    header = 'Community Care';
    const address = appointment.contained[0]?.actor?.address;
    location = `${address.line[0]} ${address.city}, ${address.state} ${
      address.postalCode
    }`;
  } else {
    header = 'VA Appointment';
    location = facility ? formatFacilityAddress(facility) : null;
  }

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-status`}
      className={itemClasses}
    >
      <div
        id={`card-${index}-type`}
        className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        {header}
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        <AppointmentDateTime
          appointmentDate={moment(appointment.start)}
          timezone={appointment.vaos.timeZone}
          facilityId={appointment.legacyVAR?.facilityId}
        />
      </h3>
      <AppointmentStatus
        status={appointment.status}
        isPastAppointment={isPastAppointment}
        index={index}
      />
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
          {isCommunityCare && (
            <ConfirmedCommunityCareLocation appointment={appointment} />
          )}
          {isVideoAppointment && (
            <VideoVisitSection appointment={appointment} />
          )}
          {isInPersonVAAppointment && (
            <VAFacilityLocation
              facility={facility}
              clinicName={appointment.clinicName}
            />
          )}
        </div>
        {isCommunityCare && (
          <CommunityCareInstructions instructions={appointment.instructions} />
        )}
        {isInPersonVAAppointment && (
          <AppointmentInstructions instructions={appointment.instructions} />
        )}
      </div>

      {!cancelled &&
        !isPastAppointment && (
          <div className="vads-u-margin-top--2">
            <AddToCalendar
              summary={header}
              description={
                appointment.comment &&
                (isInPersonVAAppointment || isCommunityCare)
                  ? appointment.comment
                  : ''
              }
              location={location}
              duration={appointment.minutesDuration}
              startDateTime={appointment.start}
              endDateTime={appointment.start}
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
                  on {formatAppointmentDate(moment(appointment.start))}
                </span>
              </button>
            )}
          </div>
        )}
    </li>
  );
}
