import React from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import {
  getConfirmedAppointmentDetailsInfo,
  selectIsCanceled,
  selectIsInPerson,
  selectIsPhone,
} from '../../redux/selectors';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import FacilityPhone from '../../../components/FacilityPhone';

function getHeading(appointment) {
  const isCanceled = selectIsCanceled(appointment);

  if (selectIsInPerson(appointment)) {
    if (isCanceled) return 'Canceled in-person appointment';
    return 'In-person appointment';
  }

  if (selectIsPhone(appointment)) {
    if (isCanceled) return 'Canceled phone appointment';
    return 'Phone appointment';
  }

  return 'Not defined';
}

export default function CancelPageLayout() {
  const { id } = useParams();
  const {
    appointment,
    bookingNotes,
    clinicName,
    clinicPhone,
    clinicPhysicalLocation,
    facility,
    facilityId,
    facilityPhone,
    isPhone,
    startDate,
    timeZoneAbbr,
    typeOfCareName,
  } = useSelector(
    state => getConfirmedAppointmentDetailsInfo(state, id),
    shallowEqual,
  );

  const heading = getHeading(appointment);
  const [reason, otherDetails] = bookingNotes.split(':');
  const provider = null;

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">{heading}</h2>
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">When</h3>
      {moment(startDate).format('ddd, MMMM D, YYYY')} <br />
      {moment(startDate).format('HH:mm:ss')} {timeZoneAbbr}
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">What</h3>
      {typeOfCareName || 'Type of care information not available'}
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">Who</h3>
      {provider || 'Provider information not available'}
      <br />
      {isPhone && (
        <>
          <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
            Scheduling facility
          </h3>
          <span>Facility: {facility?.name}</span>
          <br />
          <span>Clinic: {clinicName || `Not available`}</span>
          <br />
          <span>Location: {clinicPhysicalLocation || `Not available`}</span>
          <br />
          <FacilityPhone
            contact={clinicPhone || facilityPhone}
            heading={`${clinicPhone ? 'Clinic phone:' : 'Phone:'}`}
          />
        </>
      )}
      {!isPhone && (
        <>
          <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
            <span>Where</span>
          </h3>
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={facilityId}
            isPhone={false}
            showPhone={false}
            showDirectionsLink={false}
          />
          <br />
          <span>Clinic: {clinicName || `Not available`}</span>
          <br />
          <span>Location: {clinicPhysicalLocation || `Not available`}</span>
          <br />
          <FacilityPhone
            contact={clinicPhone || facilityPhone}
            heading={`${clinicPhone ? 'Clinic phone:' : 'Phone:'}`}
          />
        </>
      )}
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
        <span>Details you shared with your provider</span>
      </h3>
      <span>
        Reason: {`${reason && reason !== 'none' ? reason : 'Not available'}`}
      </span>
      <br />
      <span>Other details: {`${otherDetails || 'Not available'}`}</span>
    </>
  );
}
