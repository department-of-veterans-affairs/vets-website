import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import { selectFeatureMedReviewInstructions } from '../../redux/selectors';
import DetailPageLayout, {
  Section,
  What,
  When,
  Who,
  ClinicOrFacilityPhone,
  Prepare,
} from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import Address from '../Address';
import NewTabAnchor from '../NewTabAnchor';

export default function PhoneLayout({ data: appointment }) {
  const {
    clinicName,
    clinicPhone,
    clinicPhoneExtension,
    comment,
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

  const featureMedReviewInstructions = useSelector(
    selectFeatureMedReviewInstructions,
  );

  const [reason, otherDetails] = comment ? comment?.split(':') : [];

  let heading = 'Phone appointment';
  if (isPastAppointment) heading = 'Past phone appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled phone appointment';

  return (
    <DetailPageLayout heading={heading} data={appointment}>
      {APPOINTMENT_STATUS.booked === status &&
        !isPastAppointment && (
          <Section heading="How to join">
            We'll call you at the appointment time. But contact the facility you
            scheduled through if you have questions or need to reschedule.
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
            {facility.name}
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
      <Section heading="Details you shared with your provider">
        <span>
          Reason: {`${reason && reason !== 'none' ? reason : 'Not available'}`}
        </span>
        <br />
        <span>Other details: {`${otherDetails || 'Not available'}`}</span>
      </Section>
      {featureMedReviewInstructions && (
        <Prepare>
          Bring your insurance cards, a list of medications, and other things to
          share with your provider.
          <br />
          <NewTabAnchor href="https://www.va.gov/resources/what-should-i-bring-to-my-health-care-appointments/">
            Find out what to bring to your appointment
          </NewTabAnchor>
        </Prepare>
      )}
    </DetailPageLayout>
  );
}
PhoneLayout.propTypes = {
  data: PropTypes.object.isRequired,
};
