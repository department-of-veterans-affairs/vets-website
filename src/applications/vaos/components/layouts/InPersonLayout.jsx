import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import { getRealFacilityId } from '../../utils/appointment';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import DetailPageLayout, {
  Details,
  When,
  What,
  Where,
  Who,
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import Address from '../Address';
import AddToCalendarButton from '../AddToCalendarButton';
import NewTabAnchor from '../NewTabAnchor';
import {
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
} from '../../utils/events';

export default function InPersonLayout({ data: appointment }) {
  const {
    clinicName,
    clinicPhysicalLocation,
    clinicPhone,
    clinicPhoneExtension,
    facility,
    facilityPhone,
    locationId,
    isPastAppointment,
    practitionerName,
    startDate,
    status,
    typeOfCareName,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  if (!appointment) return null;

  const { reasonForAppointment, patientComments } = appointment || {};
  const facilityId = locationId;

  let heading = 'In-person appointment';
  if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled in-person appointment';
  else if (isPastAppointment) heading = 'Past in-person appointment';

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
      [NULL_STATE_FIELD.FACILITY_ID]: !facilityId,
      [NULL_STATE_FIELD.FACILITY_DETAILS]: !facility,
      [NULL_STATE_FIELD.FACILITY_PHONE]: !facilityPhone,
    },
  );

  return (
    <DetailPageLayout heading={heading} data={appointment}>
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
      <Where
        heading={
          APPOINTMENT_STATUS.booked === status ? 'Where to attend' : undefined
        }
      >
        {/* When the services return a null value for the facility (no facility ID) for all appointment types */}
        {!facility && !facilityId && (
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
        {/* When the services return a null value for the facility (but receive the facility ID) */}
        {!facility && !!facilityId && (
          <>
            <span>Facility details not available</span>
            <br />
            <NewTabAnchor
              href={`/find-locations/facility/vha_${getRealFacilityId(
                facilityId,
              )}`}
            >
              View facility information
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
            <div className="vads-u-margin-top--1 vads-u-color--link-default">
              <FacilityDirectionsLink location={facility} icon />
            </div>
            <br />
            <span>Clinic: {clinicName || 'Not available'}</span> <br />
            <span>Location: {clinicPhysicalLocation || 'Not available'}</span>
            <br />
          </>
        )}
        <ClinicOrFacilityPhone
          clinicPhone={clinicPhone}
          clinicPhoneExtension={clinicPhoneExtension}
          facilityPhone={facilityPhone}
        />
      </Where>
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
InPersonLayout.propTypes = {
  data: PropTypes.object,
};
