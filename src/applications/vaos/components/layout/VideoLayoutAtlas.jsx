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
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import { selectFeatureMedReviewInstructions } from '../../redux/selectors';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import NewTabAnchor from '../NewTabAnchor';
import Address from '../Address';
import VideoInstructions from '../VideoInstructions';
import State from '../State';

export default function VideoLayoutAtlas({ data: appointment }) {
  const {
    atlasConfirmationCode,
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
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

  const featureMedReviewInstructions = useSelector(
    selectFeatureMedReviewInstructions,
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

      {!!facility && (
        <Where
          heading={
            APPOINTMENT_STATUS.booked === status && !isPastAppointment
              ? 'Where to attend'
              : undefined
          }
        >
          <Address address={videoProviderAddress} />
          <div className="vads-u-margin-top--1 vads-u-color--link-default">
            <va-icon icon="directions" size="3" srtext="Directions icon" />{' '}
            <FacilityDirectionsLink location={facility} />
          </div>
        </Where>
      )}

      {((APPOINTMENT_STATUS.booked === status && isPastAppointment) ||
        APPOINTMENT_STATUS.cancelled === status) && (
        <Section heading="Scheduling facility">
          {!facility && (
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
              <ClinicOrFacilityPhone
                clinicPhone={clinicPhone}
                clinicPhoneExtension={clinicPhoneExtension}
                facilityPhone={facilityPhone}
              />
            </>
          )}
        </Section>
      )}

      {featureMedReviewInstructions &&
        !isPastAppointment &&
        (APPOINTMENT_STATUS.booked === status ||
          APPOINTMENT_STATUS.cancelled === status) && (
          <Prepare>
            <ul className="vads-u-margin-top--0">
              <li>
                Bring your insurance cards and a list of your medications and
                other information to share with your provider.
                <br />
                <a
                  target="_self"
                  href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
                >
                  Find a full list of things to bring to your appointment
                </a>
              </li>
              <li>
                Get your device ready to join.
                <VideoInstructions />
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
    </DetailPageLayout>
  );
}
VideoLayoutAtlas.propTypes = {
  data: PropTypes.object,
};
