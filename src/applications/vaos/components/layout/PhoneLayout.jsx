import React from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import { selectConfirmedAppointmentData } from '../../appointment-list/redux/selectors';
import DetailPageLayout, { Section, What, When, Who } from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import Address from '../Address';
import NewTabAnchor from '../NewTabAnchor';
import FacilityPhone from '../FacilityPhone';

export default function PhoneLayout({ data: appointment }) {
  const {
    clinicName,
    comment,
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
  const [reason, otherDetails] = comment ? comment?.split(':') : [];
  const oracleHealthProviderName = null;

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
      <What>{typeOfCareName || 'Type of care information not available'}</What>
      {oracleHealthProviderName && <Who>{oracleHealthProviderName}</Who>}
      <Section heading="Scheduling facility">
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
          </>
        )}
        <span>Clinic: {clinicName || 'Not available'}</span> <br />
        {facilityPhone && (
          <FacilityPhone heading="Clinic phone:" contact={facilityPhone} />
        )}
        {!facilityPhone && <>Not available</>}
      </Section>
      <Section heading="Details you shared with your provider">
        <span>
          Reason: {`${reason && reason !== 'none' ? reason : 'Not available'}`}
        </span>
        <br />
        <span>Other details: {`${otherDetails || 'Not available'}`}</span>
      </Section>
    </DetailPageLayout>
  );
}
PhoneLayout.propTypes = {
  data: PropTypes.object.isRequired,
};
