import React, { useState } from 'react';
import classNames from 'classnames';
import moment from '../../../../utils/moment-tz';
import { formatFacilityAddress } from '../../../../utils/formatters';
import {
  APPOINTMENT_STATUS,
  PURPOSE_TEXT,
  VIDEO_TYPES,
} from '../../../../utils/constants';
import VideoVisitSection from './VideoVisitSection';
import AddToCalendar from '../../../../components/AddToCalendar';
import VAFacilityLocation from '../../../../components/VAFacilityLocation';
import AppointmentDateTime from './AppointmentDateTime';
import AppointmentInstructions from './AppointmentInstructions';
import CommunityCareInstructions from './CommunityCareInstructions';
import AppointmentStatus from '../AppointmentStatus';
import ConfirmedCommunityCareLocation from './ConfirmedCommunityCareLocation';
import {
  getVARFacilityId,
  getVAAppointmentLocationId,
  isVideoAppointment,
  isAtlasLocation,
  getVideoKind,
} from '../../../../services/appointment';
import AdditionalInfoRow from '../AdditionalInfoRow';
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
  const isVideo = isVideoAppointment(appointment);
  const isInPersonVAAppointment = !isVideo && !isCommunityCare;
  const isAtlas = isAtlasLocation(appointment);
  const videoKind = getVideoKind(appointment);

  const showInstructions =
    isCommunityCare ||
    (isInPersonVAAppointment &&
      PURPOSE_TEXT.some(purpose =>
        appointment?.comment?.startsWith(purpose.short),
      ));

  const showVideoInstructions =
    isVideo &&
    appointment.comment &&
    videoKind !== VIDEO_TYPES.clinic &&
    videoKind !== VIDEO_TYPES.gfe;

  let instructionText = 'VA appointment';
  if (showInstructions) {
    instructionText = appointment.comment;
  } else if (showVideoInstructions) {
    instructionText = getVideoInstructionText(appointment.comment);
  } else if (isVideo) {
    instructionText = 'VA video appointment';
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
  let videoSummary;
  if (isAtlas) {
    header = 'VA Video Connect';
    const address =
      appointment.legacyVAR.apiData.vvsAppointments[0].tasInfo.address;
    if (address) {
      location = `${address.streetAddress}, ${address.city}, ${address.state} ${
        address.zipCode
      }`;
    }
    videoSummary = 'Video appointment at an ATLAS location';
  } else if (videoKind === VIDEO_TYPES.clinic) {
    header = 'VA Video Connect';
    location = facility ? formatFacilityAddress(facility) : null;
    videoSummary = 'Video appointment at a VA location';
  } else if (videoKind === VIDEO_TYPES.gfe) {
    header = 'VA Video Connect';
    location = 'Video conference';
    videoSummary = 'Video appointment using a VA device';
  } else if (isVideo) {
    header = 'VA Video Connect';
    location = 'Video conference';
    videoSummary = 'Video appointment at home';
  } else if (isCommunityCare) {
    header = 'Community Care';
    const address = appointment.contained.find(
      res => res.resourceType === 'Location',
    )?.address;
    if (address) {
      location = `${address.line[0]}, ${address.city}, ${address.state} ${
        address.postalCode
      }`;
    }
  } else {
    header = 'VA Appointment';
    location = facility ? formatFacilityAddress(facility) : null;
  }

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-status`}
      className={itemClasses}
      data-request-id={appointment.id}
      data-is-cancelable={!isCommunityCare && !isVideo ? 'true' : 'false'}
    >
      <div
        id={`card-${index}-type`}
        className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        {header}
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        {isVideo && videoSummary}
        {!isVideo && (
          <AppointmentDateTime
            appointmentDate={moment.parseZone(appointment.start)}
            timezone={appointment.vaos.timeZone}
            facilityId={getVARFacilityId(appointment)}
          />
        )}
      </h3>
      {isVideo && (
        <AppointmentDateTime
          appointmentDate={moment.parseZone(appointment.start)}
          timezone={appointment.vaos.timeZone}
          facilityId={getVARFacilityId(appointment)}
          twoLineFormat
        />
      )}
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
          {isVideo && (
            <VideoVisitSection facility={facility} appointment={appointment} />
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
            {showVideoInstructions && (
              <AdditionalInfoRow
                id={appointment.id}
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
              summary={isVideo ? videoSummary : header}
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
