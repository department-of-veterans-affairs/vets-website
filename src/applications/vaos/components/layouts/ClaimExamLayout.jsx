import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import { getRealFacilityId } from '../../utils/appointment';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import DetailPageLayout, {
  When,
  What,
  Where,
  ClinicOrFacilityPhone,
  Prepare,
  Who,
} from './DetailPageLayout';
import Section from '../Section';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import Address from '../Address';
import AddToCalendarButton from '../AddToCalendarButton';
import NewTabAnchor from '../NewTabAnchor';
import FacilityPhone from '../FacilityPhone';
import {
  NULL_STATE_FIELD,
  captureMissingModalityLogs,
  recordAppointmentDetailsNullStates,
} from '../../utils/events';
import ClinicPhysicalLocation from './ClinicPhysicalLocation';
import ClinicName from './ClinicName';

export default function ClaimExamLayout({ data: appointment }) {
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

  let heading = 'Claim exam';
  const facilityId = locationId;
  if (APPOINTMENT_STATUS.cancelled === status) heading = 'Canceled claim exam';
  else if (isPastAppointment) heading = 'Past claim exam';

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
      [NULL_STATE_FIELD.CLINIC_PHONE]: !clinicPhone,
      [NULL_STATE_FIELD.FACILITY_ID]: !facilityId,
      [NULL_STATE_FIELD.FACILITY_DETAILS]: !facility,
      [NULL_STATE_FIELD.FACILITY_PHONE]: !facilityPhone,
    },
  );

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      <When>
        <AppointmentDate date={startDate} timezone={appointment.timezone} />
        <br />
        <AppointmentTime
          appointment={appointment}
          timezone={appointment.timezone}
        />
        <br />
        {APPOINTMENT_STATUS.booked === status &&
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
        {typeOfCareName && (
          <span className="typeOfCareName" data-dd-privacy="mask">
            {typeOfCareName}
          </span>
        )}
      </What>
      <Who>
        {practitionerName && (
          <span data-dd-privacy="mask">{practitionerName}</span>
        )}
      </Who>
      <Where
        heading={
          APPOINTMENT_STATUS.booked === status && !isPastAppointment
            ? 'Where to attend'
            : 'Where'
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
              {facilityPhone && <FacilityPhone contact={facilityPhone} />}
              {!facilityPhone && <>Not available</>}
            </>
          )}
        </Section>
      )}

      {!isPastAppointment &&
        (APPOINTMENT_STATUS.booked === status ||
          APPOINTMENT_STATUS.cancelled === status) && (
          <Prepare>
            <ul className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              <li>You don’t need to bring anything to your exam</li>
              <li>
                If you have any new non-VA medical records (like records from a
                recent surgery or illness), be sure to submit them before your
                appointment
              </li>
            </ul>
            <a
              target="_self"
              href="https://www.va.gov/disability/va-claim-exam/"
            >
              Learn more about claim exam appointments
            </a>
          </Prepare>
        )}
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="Need to make changes?">
            Contact this facility compensation and pension office if you need to
            reschedule or cancel your appointment.
            <br />
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
ClaimExamLayout.propTypes = {
  data: PropTypes.object,
};
