import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import { getRealFacilityId } from '../../utils/appointment';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  NULL_STATE_FIELD,
  recordAppointmentDetailsNullStates,
  captureMissingModalityLogs,
} from '../../utils/events';
import Address from '../Address';
import AddToCalendarButton from '../AddToCalendarButton';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import NewTabAnchor from '../NewTabAnchor';
import ClinicName from './ClinicName';
import ClinicPhysicalLocation from './ClinicPhysicalLocation';
import DetailPageLayout, {
  ClinicOrFacilityPhone,
  Details,
  Prepare,
  What,
  When,
  Where,
  Who,
} from './DetailPageLayout';

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
    timezone,
    typeOfCareName,
    isCerner,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  if (!appointment) return null;

  const { patientComments } = appointment || {};
  const facilityId = locationId;

  let heading = 'In-person appointment';
  if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled in-person appointment';
  else if (isPastAppointment) heading = 'Past in-person appointment';

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
        <AppointmentDate date={startDate} timezone={timezone} />
        <br />
        <AppointmentTime appointment={appointment} timezone={timezone} />
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
        {practitionerName && (
          <span data-dd-privacy="mask">{practitionerName}</span>
        )}
      </Who>
      <Where
        heading={
          APPOINTMENT_STATUS.booked === status ? 'Where to attend' : undefined
        }
      >
        {/* When the services return a null value for the facility (no facility ID) for all appointment types */}
        {!facility &&
          !facilityId && (
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
        {!facility &&
          !!facilityId && (
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
            <ClinicName name={clinicName} />{' '}
            <ClinicPhysicalLocation location={clinicPhysicalLocation} /> <br />
          </>
        )}
        <ClinicOrFacilityPhone
          clinicPhone={clinicPhone}
          clinicPhoneExtension={clinicPhoneExtension}
          facilityPhone={facilityPhone}
        />
      </Where>
      <Details otherDetails={patientComments} isCerner={isCerner} />
      {!isPastAppointment &&
        (APPOINTMENT_STATUS.booked === status ||
          APPOINTMENT_STATUS.cancelled === status) && (
          <Prepare>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Bring your insurance cards, a list of your medications, and other
              things to share with your provider
            </p>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              <va-link
                text="Find out what to bring to your appointment"
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
