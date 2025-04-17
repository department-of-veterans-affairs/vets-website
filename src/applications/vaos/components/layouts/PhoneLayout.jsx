import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import DetailPageLayout, {
  Details,
  What,
  When,
  Who,
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import Section from '../Section';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import Address from '../Address';
import NewTabAnchor from '../NewTabAnchor';
import {
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
} from '../../utils/events';

export default function PhoneLayout({ data: appointment }) {
  const {
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
    facility,
    facilityPhone,
    isPastAppointment,
    practitionerName,
    startDate,
    status,
    typeOfCareName,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  const { reasonForAppointment, patientComments } = appointment || {};

  let heading = 'Phone appointment';
  if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled phone appointment';
  else if (isPastAppointment) heading = 'Past phone appointment';

  recordAppointmentDetailsNullStates(
    {
      type: appointment.type,
      modality: appointment.modality,
      isCerner: appointment.vaos.isCerner,
    },
    {
      [NULL_STATE_FIELD.TYPE_OF_CARE]: !typeOfCareName,
      [NULL_STATE_FIELD.PROVIDER]: !practitionerName,
      [NULL_STATE_FIELD.CLINIC_PHONE]: !clinicPhone,
      [NULL_STATE_FIELD.FACILITY_DETAILS]: !facility,
      [NULL_STATE_FIELD.FACILITY_PHONE]: !facilityPhone,
    },
  );

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      {APPOINTMENT_STATUS.booked === status && !isPastAppointment && (
        <Section heading="How to join">
          We’ll call you at the appointment time. If you have questions or need
          to reschedule, contact the facility you originally scheduled through.
        </Section>
      )}
      <When>
        <AppointmentDate date={startDate} />
        <br />
        <AppointmentTime appointment={appointment} />
        <br />
        {APPOINTMENT_STATUS.cancelled !== status && !isPastAppointment && (
          <div className="vads-u-margin-top--2 vaos-hide-for-print">
            <AddToCalendarButton
              appointment={appointment}
              facility={facility}
            />
          </div>
        )}
      </When>
      <What>{typeOfCareName}</What>
      <Who>{practitionerName}</Who>
      <Section heading="Scheduling facility">
        {!facility && (
          <>
            <span>Facility not available</span>
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
            <Address address={facility?.address} />
          </>
        )}
        <span>Clinic: {clinicName || 'Not available'}</span> <br />
        <ClinicOrFacilityPhone
          clinicPhone={clinicPhone}
          clinicPhoneExtension={clinicPhoneExtension}
          facilityPhone={facilityPhone}
        />
      </Section>
      <Details reason={reasonForAppointment} otherDetails={patientComments} />
      {!isPastAppointment &&
        (APPOINTMENT_STATUS.booked === status ||
          APPOINTMENT_STATUS.cancelled === status) && (
          <Prepare>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Bring your insurance cards. And bring a list of your medications
              and other information to share with your provider.
            </p>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              <va-link
                text="Find a full list of things to bring to your appointment"
                href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
              />
            </p>
          </Prepare>
        )}
    </DetailPageLayout>
  );
}
PhoneLayout.propTypes = {
  data: PropTypes.object.isRequired,
};
