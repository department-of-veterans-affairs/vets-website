import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'recompose';
import VideoLayoutAtlas from './VideoLayoutAtlas';
import {
  selectConfirmedAppointmentData,
  selectIsAtlasVideo,
} from '../../appointment-list/redux/selectors';
import VideoLayoutVA from './VideoLayoutVA';
import { isClinicVideoAppointment } from '../../services/appointment';
import DetailPageLayout, {
  Section,
  What,
  When,
  Who,
  ClinicOrFacilityPhone,
} from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import NewTabAnchor from '../NewTabAnchor';
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
            We'll add the link to join this appointment 30 minutes before your
            appointment time.
            <br />
            <br />
            <va-additional-info trigger="How to setup your device" uswds>
              <div>
                <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                  Before your appointment:
                </h4>
                <ul>
                  <li>
                    If you’re using an iPad or iPhone for your appointment,
                    you’ll need to download the{' '}
                    <NewTabAnchor href="https://itunes.apple.com/us/app/va-video-connect/id1224250949?mt=8">
                      VA Video Connect iOS app
                    </NewTabAnchor>{' '}
                    beforehand. If you’re using any other device, you don’t need
                    to download any software or app before your appointment.
                  </li>
                  <li>
                    You’ll need to have access to a web camera and microphone.
                    You can use an external camera and microphone if your device
                    doesn’t have one.
                  </li>
                </ul>

                <p>
                  To connect to your Virtual Meeting Room at the appointment
                  time, click the "Join session" button on this page or the link
                  that's in your confirmation email.
                </p>
                <h4 className="vads-u-font-size--base vads-u-font-family--sans">
                  To have the best possible video experience, we recommend you:
                </h4>
                <ul>
                  <li>
                    Connect to your video appointment from a quiet, private, and
                    well-lighted location
                  </li>
                  <li>
                    Check to ensure you have a strong Internet connection before
                    your appointment
                  </li>
                  <li>
                    Connect to your appointment using a Wi-Fi network if using
                    your mobile phone, rather than your cellular data network
                  </li>
                </ul>
              </div>
            </va-additional-info>
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
            {!facility && (
              <>
                <span>Facility not available</span>
              </>
            )}
            {facility && (
              <>
                {facility.name}
                <br />
                <span>
                  {address.city}, <State state={address.state} />
                </span>
              </>
            )}
            <br />
            {clinicName && (
              <>
                <span>Clinic: {clinicName}</span> <br />
              </>
            )}
            {!clinicName && (
              <>
                <span>Clinic not available</span> <br />
              </>
            )}
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
          {clinicName && (
            <>
              <span>Clinic: {clinicName}</span> <br />
            </>
          )}
          {!clinicName && (
            <>
              <span>Clinic not available</span>
            </>
          )}
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
