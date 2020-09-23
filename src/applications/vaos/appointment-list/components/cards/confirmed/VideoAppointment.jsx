import React, { useState } from 'react';
import classNames from 'classnames';
import moment from '../../../../utils/moment-tz';
import { APPOINTMENT_STATUS, VIDEO_TYPES } from '../../../../utils/constants';
import VideoVisitSection from './VideoVisitSection';
import AddToCalendar from '../../../../components/AddToCalendar';
import VAFacilityLocation from '../../../../components/VAFacilityLocation';
import VideoAppointmentDateTime from './VideoAppointmentDateTime';
import AppointmentStatus from '../AppointmentStatus';
import {
  getVARFacilityId,
  getVAAppointmentLocationId,
  isVideoAppointment,
  getVideoKind,
} from '../../../../services/appointment';
import AdditionalInfoRow from '../AdditionalInfoRow';
import {
  getVideoInstructionText,
  VideoVisitInstructions,
} from './VideoInstructions';
import { formatFacilityAddress } from '../../../../utils/formatters';

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

export default function VideoAppointment({
  appointment,
  index,
  cancelAppointment,
  showCancelButton,
  facility,
}) {
  const [showMoreOpen, setShowMoreOpen] = useState(false);
  const cancelled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.vaos.isPastAppointment;
  const isVideo = isVideoAppointment(appointment);
  const videoKind = getVideoKind(appointment);

  let instructionText = 'VA video visit';
  if (appointment.comment) {
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

  let videoSummary = 'Video appointment at home';
  if (videoKind === VIDEO_TYPES.clinic) {
    videoSummary = 'Video appointment at a VA location';
  } else if (videoKind === VIDEO_TYPES.gfe) {
    videoSummary = 'Video appointment using a VA device';
  }

  const location = facility
    ? formatFacilityAddress(facility)
    : 'Video conference';

  return (
    <li
      aria-labelledby={`card-${index}-type card-${index}-status`}
      className={itemClasses}
      data-request-id={appointment.id}
      data-is-cancelable="false"
    >
      <div
        id={`card-${index}-type`}
        className="vaos-form__title vads-u-font-size--sm vads-u-font-weight--normal vads-u-font-family--sans"
      >
        VA Video Connect
      </div>
      <h3 className="vaos-appts__date-time vads-u-font-size--h3 vads-u-margin-x--0">
        {videoSummary}
      </h3>
      <VideoAppointmentDateTime
        appointmentDate={moment.parseZone(appointment.start)}
        timezone={appointment.vaos.timeZone}
        facilityId={getVARFacilityId(appointment)}
      />
      <AppointmentStatus
        status={appointment.status}
        isPastAppointment={isPastAppointment}
        index={index}
      />
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <div className="vads-u-flex--1 vads-u-margin-bottom--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
          <VideoVisitSection appointment={appointment} />
        </div>
      </div>
      {videoKind === VIDEO_TYPES.clinic && (
        <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
          <div className="vads-u-flex--1 vads-u-margin-bottom--2 vads-u-margin-right--1 vaos-u-word-break--break-word">
            <VAFacilityLocation
              facility={facility}
              facilityId={parseFakeFHIRId(
                getVAAppointmentLocationId(appointment),
              )}
            />
          </div>
        </div>
      )}

      {!cancelled &&
        !isPastAppointment && (
          <div className="vads-u-margin-top--2 vads-u-display--flex vads-u-flex-wrap--wrap">
            {isVideo &&
              appointment.comment &&
              videoKind !== VIDEO_TYPES.clinic && (
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
              summary={videoSummary}
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
