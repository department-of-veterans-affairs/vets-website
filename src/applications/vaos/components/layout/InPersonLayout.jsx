import React from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import {
  AppointmentDate,
  AppointmentTime,
} from '../../appointment-list/components/AppointmentDateTime';
import { getConfirmedAppointmentDetailsInfo } from '../../appointment-list/redux/selectors';
import StatusAlert from '../StatusAlert';
import DetailPageLayout, {
  When,
  What,
  Where,
  Section,
  Who,
} from './DetailPageLayout';
import { APPOINTMENT_STATUS } from '../../utils/constants';
import FacilityDirectionsLink from '../FacilityDirectionsLink';
import Address from '../Address';
import { selectFeaturePhysicalLocation } from '../../redux/selectors';
import AddToCalendarButton from '../AddToCalendarButton';
import NewTabAnchor from '../NewTabAnchor';
import FacilityPhone from '../FacilityPhone';

export function InPersonLayout() {
  const { id } = useParams();
  const {
    appointment,
    clinicName,
    clinicPhysicalLocation,
    comment,
    facility,
    facilityPhone,
    startDate,
    status,
    typeOfCareName,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );
  const featurePhysicalLocation = useSelector(state =>
    selectFeaturePhysicalLocation(state),
  );
  const [reason, otherDetails] = comment ? comment?.split(':') : [];
  const oracleHealthProviderName = null;

  return (
    <DetailPageLayout
      header={`${
        APPOINTMENT_STATUS.cancelled === status
          ? 'Canceled in-person appointment'
          : 'In-person appointment'
      }`}
    >
      <StatusAlert
        appointment={appointment}
        facility={facility}
        showScheduleLink
      />
      <When>
        <AppointmentDate date={startDate} />
        <br />
        <AppointmentTime appointment={appointment} />
        <br />
        {APPOINTMENT_STATUS.cancelled !== status && (
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
      <Where>
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
        {featurePhysicalLocation && (
          <>
            <span>Location: {clinicPhysicalLocation || 'Not available'}</span>{' '}
            <br />
          </>
        )}
        {facilityPhone && (
          <FacilityPhone heading="Clinic phone:" contact={facilityPhone} />
        )}
        {!facilityPhone && <>Not available</>}
      </Where>
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
