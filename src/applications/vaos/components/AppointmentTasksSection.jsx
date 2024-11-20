import React from 'react';
import PropTypes from 'prop-types';
import { getDaysRemainingToFileClaim } from '../utils/appointment';
import {
  selectAppointmentTravelClaim,
  selectIsPast,
  selectIsInPerson,
  selectIsClinicVideo,
} from '../appointment-list/redux/selectors';
import Section from './Section';

export default function AppointmentTasksSection({ appointment }) {
  const isPastAppointment = selectIsPast(appointment);
  if (!isPastAppointment) return null;

  const isInPerson = selectIsInPerson(appointment);
  const isClinicVideo = selectIsClinicVideo(appointment);
  // If it's not an in-person appointment or a clinic video appointment, don't show the link to file a claim
  if (!isInPerson && !isClinicVideo) return null;

  const claimData = selectAppointmentTravelClaim(appointment);
  // if there is no claim data or the claim data is not successful or the claim has already been filed, don't show the link to file a claim
  if (
    !claimData ||
    !claimData.metadata.success ||
    (claimData.metadata.success && claimData.claim)
  )
    return null;

  const daysRemainingToFileClaim = getDaysRemainingToFileClaim(
    appointment.start,
  );
  if (daysRemainingToFileClaim < 1) return null;

  return (
    <Section heading="Appointment tasks">
      <va-link-action
        data-testid="file-claim-link"
        className="vads-u-margin-top--1"
        href={`/appointments/claims/?date=${appointment.start}`}
        text="File a travel reimbursement claim"
      />
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1 vads-u-margin-left--4">
        Days left to file: {daysRemainingToFileClaim}
      </p>
    </Section>
  );
}

AppointmentTasksSection.propTypes = {
  appointment: PropTypes.object,
};
