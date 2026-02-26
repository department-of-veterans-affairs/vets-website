import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import VideoLayoutAtlas from './VideoLayoutAtlas';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import VideoLayoutVA from './VideoLayoutVA';
import {
  isClinicVideoAppointment,
  isAtlasVideoAppointment,
} from '../../services/appointment';
import DetailPageLayout, {
  What,
  When,
  Who,
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import Section from '../Section';
import VideoLink from '../VideoLink';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import State from '../State';
import {
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
  captureMissingModalityLogs,
} from '../../utils/events';
import ClinicName from './ClinicName';

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

  const isAtlasVideo = useSelector(() => isAtlasVideoAppointment(appointment));
  const isClinicVideo = isClinicVideoAppointment(appointment);

  if (isAtlasVideo) return <VideoLayoutAtlas data={appointment} />;
  if (isClinicVideo) return <VideoLayoutVA data={appointment} />;

  const address = facility?.address;
  let heading = 'Video appointment';
  if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled video appointment';
  else if (isPastAppointment) heading = 'Past video appointment';

  if (!appointment.modality) {
    captureMissingModalityLogs(appointment);
  }
  recordAppointmentDetailsNullStates(
    {
      type: appointment.type,
      modality: appointment.modality,
      isCerner: appointment.vaos.isCerner,
    },
    {
      [NULL_STATE_FIELD.TYPE_OF_CARE]: !typeOfCareName,
      [NULL_STATE_FIELD.PROVIDER]: !videoProviderName,
      [NULL_STATE_FIELD.CLINIC_PHONE]: !clinicPhone,
      [NULL_STATE_FIELD.FACILITY_DETAILS]: !facility,
      [NULL_STATE_FIELD.FACILITY_PHONE]: !facilityPhone,
    },
  );

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="How to join">
            <VideoLink appointment={appointment} />
          </Section>
        )}
      <When>
        <AppointmentDate date={startDate} timezone={appointment.timezone} />
        <br />
        <AppointmentTime
          appointment={appointment}
          timezone={appointment.timezone}
        />
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

      <What>
        {typeOfCareName && <span data-dd-privacy="mask">{typeOfCareName}</span>}
      </What>

      <Who>
        {videoProviderName && (
          <span data-dd-privacy="mask">{videoProviderName}</span>
        )}
      </Who>

      {((APPOINTMENT_STATUS.booked === status && isPastAppointment) ||
        isCanceledAppointment) && (
        <Section heading="Scheduling facility">
          {!!facility && (
            <>
              <a href={facility.website}>{facility.name}</a>
              <br />
              <span>
                {address.city}, <State state={address.state} />
              </span>
            </>
          )}
          <ClinicName name={clinicName} /> <br />
          <ClinicOrFacilityPhone
            clinicPhone={clinicPhone}
            clinicPhoneExtension={clinicPhoneExtension}
            facilityPhone={facilityPhone}
          />
        </Section>
      )}

      {!isPastAppointment &&
        (APPOINTMENT_STATUS.booked === status ||
          APPOINTMENT_STATUS.cancelled === status) && (
          <Prepare>
            <ul className="vads-u-margin-top--0">
              <li>
                Bring your insurance cards, a list of your medications, and
                other things to share with your provider
                <br />
                <va-link
                  text="Find out what to bring to your appointment"
                  href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
                />
              </li>
              <li>
                Get your device ready to join
                <br />
                <va-link
                  text="Learn how to prepare for your video appointment"
                  href="https://www.va.gov/resources/how-should-i-prepare-for-a-video-health-appointment/"
                />
              </li>
            </ul>
          </Prepare>
        )}

      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="Need to make changes?">
            Contact this facility if you need to reschedule or cancel your
            appointment.
            <br />
            <br />
            {facility ? (
              <>
                <a href={facility.website}>{facility.name}</a>
                <br />
                <span>
                  {address.city}, <State state={address.state} />
                </span>
              </>
            ) : (
              'Facility not available'
            )}
            <ClinicName name={clinicName} /> <br />
            <ClinicOrFacilityPhone
              clinicPhone={clinicPhone}
              clinicPhoneExtension={clinicPhoneExtension}
              facilityPhone={facilityPhone}
            />
          </Section>
        )}
    </DetailPageLayout>
  );
}
VideoLayout.propTypes = {
  data: PropTypes.object,
};
