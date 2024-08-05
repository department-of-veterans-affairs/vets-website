import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import { getRealFacilityId } from '../../utils/appointment';
import DetailPageLayout, {
  Section,
  What,
  When,
  Who,
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { selectFeatureMedReviewInstructions } from '../../redux/selectors';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import NewTabAnchor from '../NewTabAnchor';
import Address from '../Address';
import FacilityDirectionsLink from '../FacilityDirectionsLink';

export default function VideoLayoutVA({ data: appointment }) {
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
    videoProviderName,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  const featureMedReviewInstructions = useSelector(
    selectFeatureMedReviewInstructions,
  );

  let heading = 'Video appointment at VA location';
  const facilityId = locationId;
  if (isPastAppointment) heading = 'Past video appointment at VA location';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled video appointment at VA location';

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="How to join">
            Join this video appointment at a VA facility.
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
      <Section heading="Where to attend">
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
            </>
          )}
        {!!facility && (
          <>
            {facility.name}
            <br />
            <Address address={facility?.address} />
            <div className="vads-u-margin-top--1 vads-u-color--link-default">
              <va-icon icon="directions" size="3" srtext="Directions icon" />{' '}
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
      </Section>
      {featureMedReviewInstructions &&
        !isPastAppointment &&
        (APPOINTMENT_STATUS.booked === status ||
          APPOINTMENT_STATUS.cancelled === status) && (
          <Prepare>
            <p className="vads-u-margin-top--0 vads-u-margin-bottom--0">
              Bring your insurance cards, a list of medications, and other
              things to share with your provider.
            </p>
            <a
              target="_self"
              href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/"
            >
              Find out what to bring to your appointment
            </a>
          </Prepare>
        )}
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="Need to make changes?">
            Contact this facility if you need to reschedule or cancel your
            appointment.
          </Section>
        )}
    </DetailPageLayout>
  );
}
VideoLayoutVA.propTypes = {
  data: PropTypes.object,
};
