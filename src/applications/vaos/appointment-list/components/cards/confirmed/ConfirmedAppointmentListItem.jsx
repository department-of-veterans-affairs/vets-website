import React, { useState } from 'react';
import classNames from 'classnames';
import moment from '../../../../lib/moment-tz';
import { formatFacilityAddress } from '../../../../services/location';
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
  getATLASLocation,
  getVARFacilityId,
  getVAAppointmentLocationId,
  isVideoAppointment,
  isVAPhoneAppointment,
  isAtlasLocation,
  getVideoKind,
  hasPractitioner,
} from '../../../../services/appointment';
import AdditionalInfoRow from '../AdditionalInfoRow';
import {
  getVideoInstructionText,
  VideoVisitInstructions,
} from './VideoInstructions';
import VideoVisitProviderSection from './VideoVisitProvider';

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
  const isPhone = isVAPhoneAppointment(appointment);
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

  const showProvider = isVideo && hasPractitioner(appointment);

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
  let subHeader = '';

  if (isAtlas) {
    header = 'VA Video Connect';
    subHeader = ' at an ATLAS location';
    const atlasLocation = getATLASLocation(appointment);
    if (atlasLocation?.address) {
      location = formatFacilityAddress(atlasLocation);
    }
  } else if (videoKind === VIDEO_TYPES.clinic) {
    header = 'VA Video Connect';
    subHeader = ' at a VA location';
    location = facility ? formatFacilityAddress(facility) : null;
  } else if (videoKind === VIDEO_TYPES.gfe) {
    header = 'VA Video Connect';
    subHeader = ' using a VA device';
    location = 'Video conference';
  } else if (isVideo) {
    header = 'VA Video Connect';
    subHeader = ' at home';
    location = 'Video conference';
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
    if (isPhone) {
      subHeader = ' over the phone';
      location = 'Phone call';
    }
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
        className="vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        <span className="vaos-form__title">{header}</span>
        <span>{subHeader}</span>
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        <AppointmentDateTime
          appointmentDate={moment.parseZone(appointment.start)}
          timezone={appointment.vaos.timeZone}
          facilityId={getVARFacilityId(appointment)}
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
          {isVideo && (
            <VideoVisitSection facility={facility} appointment={appointment} />
          )}
          {isInPersonVAAppointment && (
            <VAFacilityLocation
              facility={facility}
              facilityId={getVAAppointmentLocationId(appointment)}
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

      {showProvider && (
        <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          <div className="vads-u-flex--1 vads-u-margin-bottom--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
            <VideoVisitProviderSection participants={appointment.participant} />
          </div>
        </div>
      )}

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
              summary={`${header}${subHeader}`}
              description={instructionText}
              location={location}
              duration={appointment.minutesDuration}
              startDateTime={appointment.start}
            />
            {showCancelButton && (
              <button
                onClick={() => cancelAppointment(appointment)}
                aria-label={`Cancel appointment on ${formatAppointmentDate(
                  moment.parseZone(appointment.start),
                )}`}
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
