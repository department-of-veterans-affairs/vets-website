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
import { selectFeatureMedReviewInstructions } from '../../redux/selectors';
import DetailPageLayout, {
  When,
  What,
  Where,
  Section,
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import Address from '../Address';
import AddToCalendarButton from '../AddToCalendarButton';
import NewTabAnchor from '../NewTabAnchor';
import FacilityPhone from '../FacilityPhone';

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
    startDate,
    status,
    typeOfCareName,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  const featureMedReviewInstructions = useSelector(
    selectFeatureMedReviewInstructions,
  );

  if (!appointment) return null;

  let heading = 'Claim exam';
  const facilityId = locationId;
  if (isPastAppointment) heading = 'Past claim exam';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled claim exam';

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      <When>
        <AppointmentDate date={startDate} />
        <br />
        <AppointmentTime appointment={appointment} />
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
      <What>{typeOfCareName}</What>
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
            {facility.name}
            <br />
            <Address address={facility?.address} />
            <div className="vads-u-margin-top--1 vads-u-color--link-default">
              <va-icon icon="directions" size="3" srtext="Directions icon" />
              <FacilityDirectionsLink location={facility} />
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
              {facilityPhone && (
                <FacilityPhone heading="Phone:" contact={facilityPhone} />
              )}
              {!facilityPhone && <>Not available</>}
            </>
          )}
        </Section>
      )}
      {featureMedReviewInstructions && (
        <Prepare>
          <ul>
            <li>You don't need to bring anything to your exam.</li>
            <li>
              If you have any new non-VA medical records (like records from a
              recent surgery or illness), be sure to submit them before your
              appointment.
            </li>
          </ul>
          <NewTabAnchor href="https://www.va.gov/disability/va-claim-exam/">
            Learn more about claim exam appointments
          </NewTabAnchor>
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
