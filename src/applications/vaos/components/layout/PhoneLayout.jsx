import React from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import { getConfirmedAppointmentDetailsInfo } from '../../appointment-list/redux/selectors';
import DetailPageLayout, { Section, What, When, Who } from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import StatusAlert from '../StatusAlert';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import AddToCalendarButton from '../AddToCalendarButton';
import Address from '../Address';
import NewTabAnchor from '../NewTabAnchor';
import FacilityPhone from '../FacilityPhone';

export default function PhoneLayout() {
  const { id } = useParams();
  const {
    appointment,
    clinicName,
    comment,
    facility,
    facilityPhone,
    isPastAppointment,
    startDate,
    status,
    typeOfCareName,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const [reason, otherDetails] = comment ? comment?.split(':') : [];
  const oracleHealthProviderName = null;

  let heading = 'Phone appointment';
  if (isPastAppointment) heading = 'Past phone appointment';
  else if (APPOINTMENT_STATUS.cancelled === status)
    heading = 'Canceled phone appointment';

  return (
    <DetailPageLayout heading={heading}>
      <StatusAlert
        appointment={appointment}
        facility={facility}
        showScheduleLink
      />
      {!isPastAppointment && (
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
      <What>{typeOfCareName || 'Type of care not noted'}</What>
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
          Reason: {`${reason && reason !== 'none' ? reason : 'Not noted'}`}
        </span>
        <br />
        <span>Other details: {`${otherDetails || 'Not noted'}`}</span>
      </Section>
    </DetailPageLayout>
  );
}
