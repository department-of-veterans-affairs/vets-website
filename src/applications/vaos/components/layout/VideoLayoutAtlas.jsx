import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import DetailPageLayout, {
  Section,
  What,
  When,
  Where,
  Who,
} from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import NewTabAnchor from '../NewTabAnchor';
import Address from '../Address';
import FacilityPhone from '../FacilityPhone';
import State from '../State';

export default function VideoLayoutAtlas({ data: appointment }) {
  const {
    atlasConfirmationCode,
    clinicName,
    facility,
    facilityPhone,
    isPastAppointment,
    startDate,
    status,
    typeOfCareName,
    videoProviderAddress,
    videoProviderName,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  const address = facility?.address;
  let heading = 'Video appointment at an ATLAS location';
  if (isPastAppointment)
    heading = 'Past video appointment at an ATLAS location';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled video appointment at an ATLAS location';

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="How to join">
            You will use this appointment code to find your appointment using
            the computer provided at the site:
            <br />
            {atlasConfirmationCode}
            <br />
            <br />
            <va-additional-info trigger="How to prepare for your visit" uswds>
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

      <What>{typeOfCareName || 'Type of care not noted'}</What>

      <Who>{videoProviderName}</Who>
      <Where
        heading={
          APPOINTMENT_STATUS.booked === status && !isPastAppointment
            ? 'Where to attend'
            : undefined
        }
      >
        {!!facility && (
          <>
            <Address address={videoProviderAddress} />
            <div className="vads-u-margin-top--1 vads-u-color--link-default">
              <va-icon icon="directions" size="3" srtext="Directions icon" />{' '}
              <FacilityDirectionsLink location={facility} />
            </div>
          </>
        )}
      </Where>
      {((APPOINTMENT_STATUS.booked === status && isPastAppointment) ||
        APPOINTMENT_STATUS.cancelled === status) && (
        <Section heading="Scheduling facility">
          {!!facility === false && (
            <>
              <span>Facility details not available</span>
              <br />
              <NewTabAnchor href="/find-locations">
                Find facility information
              </NewTabAnchor>
              <br />
              <br />
            </>
          )}
          {!!facility && (
            <>
              {facility.name}
              <br />
              {facilityPhone && (
                <FacilityPhone heading="Phone:" contact={facilityPhone} />
              )}
              {!facilityPhone && <>Not available</>}
            </>
          )}
        </Section>
      )}
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="Need to make changes?">
            Contact this facility if you need to reschedule or cancel your
            appointment.
            <br />
            <br />
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
            <span>Clinic: {clinicName || 'Not available'}</span> <br />
            {facilityPhone && (
              <FacilityPhone heading="Clinic phone:" contact={facilityPhone} />
            )}
          </Section>
        )}
    </DetailPageLayout>
  );
}
VideoLayoutAtlas.propTypes = {
  data: PropTypes.object,
};
