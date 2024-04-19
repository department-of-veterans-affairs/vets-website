import React from 'react';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
  const [number, extension] = facilityPhone?.split('x');
  const [reason, otherDetails] = comment.split(':');
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
          <div className="vads-u-margin-top--2">
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
        {!!facility?.name && (
          <>
            {facility.name}
            <br />
          </>
        )}
        <Address address={facility?.address} />
        <div className="vads-u-display--flex vads-u-margin-top--1 vads-u-color--link-default">
          <va-icon icon="directions" size="3" srtext="Directions icon" />{' '}
          <FacilityDirectionsLink location={facility} />
        </div>
        <br />
        <span>Clinic: {clinicName}</span> <br />
        {featurePhysicalLocation &&
          clinicPhysicalLocation && (
            <>
              <span>Location: {clinicPhysicalLocation}</span> <br />
            </>
          )}
        <span>
          Clinic phone:{' '}
          <VaTelephone
            contact={number}
            extension={extension}
            data-testid="facility-telephone"
          />{' '}
          (<VaTelephone contact="711" tty data-testid="tty-telephone" />)
        </span>
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
