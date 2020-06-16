import React, { useState } from 'react';
import classNames from 'classnames';
import moment from '../utils/moment-tz';
import { formatFacilityAddress } from '../utils/formatters';
import { APPOINTMENT_STATUS, PURPOSE_TEXT } from '../utils/constants';
import VideoVisitSection from './VideoVisitSection';
import AddToCalendar from './AddToCalendar';
import VAFacilityLocation from './VAFacilityLocation';
import AppointmentDateTime from './AppointmentDateTime';
import AppointmentInstructions from './AppointmentInstructions';
import CommunityCareInstructions from './CommunityCareInstructions';
import AppointmentStatus from './AppointmentStatus';
import ConfirmedCommunityCareLocation from './ConfirmedCommunityCareLocation';
import {
  getVARFacilityId,
  getVAAppointmentLocationId,
} from '../services/appointment';
import AdditionalInfoRow from './AdditionalInfoRow';
import {
  getVideoInstructionText,
  VideoVisitInstructions,
} from './VideoInstructions';

// Only use this when we need to pass data that comes back from one of our
// services files to one of the older api functions
function parseFakeFHIRId(id) {
  return id ? id.replace('var', '') : id;
}

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
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.vaos.isPastAppointment;
  const isCommunityCare = appointment.vaos.isCommunityCare;
  const isInPersonVAAppointment =
    !appointment.vaos.videoType && !isCommunityCare;
  const isVideoAppointment = !!appointment.vaos.videoType;

  const showInstructions =
    isCommunityCare ||
    (isInPersonVAAppointment &&
      PURPOSE_TEXT.some(purpose =>
        appointment?.comment?.startsWith(purpose.short),
      ));

  let instructionText;
  if (showInstructions) {
    instructionText = appointment.comment;
  } else if (isVideoAppointment && appointment.comment) {
    instructionText = getVideoInstructionText(appointment.comment);
  }

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
    const address = appointment.contained[0].actor.address;
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
      data-request-id={appointment.id}
      data-is-cancelable={
        !appointment.isCommunityCare && !appointment.videoType
          ? 'true'
          : 'false'
      }
    >
      <div
        id={`card-${index}-type`}
        className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        {header}
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        <AppointmentDateTime
          appointmentDate={moment.parseZone(appointment.start)}
          timezone={appointment.vaos.timeZone}
          facilityId={parseFakeFHIRId(getVARFacilityId(appointment))}
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
              facilityId={parseFakeFHIRId(
                getVAAppointmentLocationId(appointment),
              )}
              clinicName={appointment.participant[0].actor.display}
            />
          )}
        </div>
        {showInstructions && (
          <>
            {isCommunityCare && (
              <CommunityCareInstructions instructions={appointment.comment} />
            )}
            {isInPersonVAAppointment && (
              <AppointmentInstructions instructions={appointment.comment} />
            )}
          </>
        )}
      </div>

      {!cancelled &&
        !isPastAppointment && (
          <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-flex-wrap--wrap">
            {isVideoAppointment &&
              appointment.comment && (
                <AdditionalInfoRow
                  open={showMoreOpen}
                  triggerText="Prepare for video visit"
                  onClick={() => setShowMoreOpen(!showMoreOpen)}
                >
                  <VideoVisitInstructions
                    instructionsType={appointment.comment}
                  />
                </AdditionalInfoRow>
              )}
            <AddToCalendar
              summary={header}
              description={instructionText}
              location={location}
              duration={appointment.minutesDuration}
              startDateTime={appointment.start}
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
                  on{' '}
                  {formatAppointmentDate(moment.parseZone(appointment.start))}
                </span>
              </button>
            )}
            <div className="vaos-flex-break" />
          </div>
        )}
    </li>
  );
}
