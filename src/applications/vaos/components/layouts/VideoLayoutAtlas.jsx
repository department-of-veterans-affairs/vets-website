import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import DetailPageLayout, {
  What,
  When,
  Where,
  Who,
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import Section from '../Section';
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
import State from '../State';
import {
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
  captureMissingModalityLogs,
} from '../../utils/events';
import ClinicName from './ClinicName';

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

  const address = facility?.address;
  let heading = 'Video appointment at an ATLAS location';
  if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled video appointment at an ATLAS location';
  else if (isPastAppointment)
    heading = 'Past video appointment at an ATLAS location';

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
            You’ll use this appointment code to find your appointment using the
            computer provided at the site: {atlasConfirmationCode}
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
            <FacilityDirectionsLink location={facility} icon />
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
              <a href={facility.website}>{facility.name}</a>
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
VideoLayoutAtlas.propTypes = {
  data: PropTypes.object,
};
