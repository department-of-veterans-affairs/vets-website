import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import VideoLayoutAtlas from './VideoLayoutAtlas';
import {
  selectConfirmedAppointmentData,
  selectIsAtlasVideo,
} from '../../appointment-list/redux/selectors';
import { selectFeatureMedReviewInstructions } from '../../redux/selectors';
import VideoLayoutVA from './VideoLayoutVA';
import { isClinicVideoAppointment } from '../../services/appointment';
import DetailPageLayout, {
  Section,
  What,
  When,
  Who,
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import VideoLink from '../VideoLink';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import VideoInstructions from '../VideoInstructions';
import State from '../State';

export default function VideoLayout({ data: appointment }) {
  const {
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
    facility,
    facilityPhone,
    isCanceledAppointment,
    isPastAppointment,
    startDate,
    status,
    typeOfCareName,
    // videoProviderAddress,
    videoProviderName,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  const featureMedReviewInstructions = useSelector(
    selectFeatureMedReviewInstructions,
  );

  const isAtlasVideo = useSelector(() => selectIsAtlasVideo(appointment));
  const isClinicVideo = isClinicVideoAppointment(appointment);

  if (isAtlasVideo) return <VideoLayoutAtlas data={appointment} />;
  if (isClinicVideo) return <VideoLayoutVA data={appointment} />;

  const address = facility?.address;
  let heading = 'Video appointment';
  if (isPastAppointment) heading = 'Past video appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled video appointment';

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="How to join">
            <VideoLink appointment={appointment} />
          </Section>
        )}
      <When>
        <AppointmentDate date={startDate} />
        <br />
        <AppointmentTime appointment={appointment} />
        <br />
        {APPOINTMENT_STATUS.cancelled !== status &&
          !isPastAppointment && (
            <div className="vads-u-margin-top--2 vaos-hide-for-print">
              <AddToCalendarButton
                appointment={appointment}
                facility={facility}
              />
            </div>
          )}
      </When>

      <What>{typeOfCareName}</What>

      <Who>{videoProviderName}</Who>
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="Need to make changes?">
            Contact this facility if you need to reschedule or cancel your
            appointment.
            <br />
            <br />
            {facility ? (
              <>
                {facility.name}
                <br />
                <span>
                  {address.city}, <State state={address.state} />
                </span>
              </>
            ) : (
              'Facility not available'
            )}
            <br />
            {clinicName ? `Clinic: ${clinicName}` : 'Clinic not available'}
            <br />
            <ClinicOrFacilityPhone
              clinicPhone={clinicPhone}
              clinicPhoneExtension={clinicPhoneExtension}
              facilityPhone={facilityPhone}
            />
          </Section>
        )}
      {((APPOINTMENT_STATUS.booked === status && isPastAppointment) ||
        isCanceledAppointment) && (
        <Section heading="Scheduling facility">
          {!!facility && (
            <>
              {facility.name}
              <br />
              <span>
                {address.city}, <State state={address.state} />
              </span>
            </>
          )}
          <br />
          {clinicName ? `Clinic: ${clinicName}` : 'Clinic not available'}
          <br />
          <ClinicOrFacilityPhone
            clinicPhone={clinicPhone}
            clinicPhoneExtension={clinicPhoneExtension}
            facilityPhone={facilityPhone}
          />
        </Section>
      )}
      {featureMedReviewInstructions &&
        !isPastAppointment &&
        (APPOINTMENT_STATUS.booked === status ||
          APPOINTMENT_STATUS.cancelled === status) && (
          <Prepare>
            <ul>
              <li>
                Bring your insurance cards, a list of medications, and other
                things to share with your provider
                <br />
                <a
                  target="_self"
                  href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
                >
                  Find out what to bring to your appointment
                </a>
              </li>
              <li>
                Get your device ready to join.
                <VideoInstructions />
              </li>
            </ul>
          </Prepare>
        )}
    </DetailPageLayout>
  );
}
VideoLayout.propTypes = {
  data: PropTypes.object,
};
