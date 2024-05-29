import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import DetailPageLayout, { Section, What, When, Who } from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import NewTabAnchor from '../NewTabAnchor';
import Address from '../Address';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import FacilityPhone from '../FacilityPhone';

export default function VideoLayoutVA({ data: appointment }) {
  const {
    clinicName,
    clinicPhysicalLocation,
    facility,
    facilityPhone,
    isPastAppointment,
    startDate,
    status,
    typeOfCareName,
  } = useSelector(
    state => selectConfirmedAppointmentData(state, appointment),
    shallowEqual,
  );

  let heading = 'Video appointment at VA location';
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

      <What>{typeOfCareName || 'Type of care not noted'}</What>

      <Who />
      <Section heading="Where to attend">
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
            <Address address={facility?.address} />
            <div className="vads-u-margin-top--1 vads-u-color--link-default">
              <va-icon icon="directions" size="3" srtext="Directions icon" />{' '}
              <FacilityDirectionsLink location={facility} />
            </div>
            <br />
          </>
        )}
        <span>Clinic: {clinicName || 'Not available'}</span> <br />
        <span>Location: {clinicPhysicalLocation || 'Not available'}</span>{' '}
        <br />
        {facilityPhone && (
          <FacilityPhone heading="Clinic phone:" contact={facilityPhone} />
        )}
        {!facilityPhone && <>Not available</>}
      </Section>
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
