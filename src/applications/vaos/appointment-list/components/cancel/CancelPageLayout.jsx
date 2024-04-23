import React from 'react';
import { useParams } from 'react-router-dom';
import { shallowEqual } from 'recompose';
import { useSelector } from 'react-redux';
import {
  getConfirmedAppointmentDetailsInfo,
  selectIsCanceled,
  selectIsInPerson,
} from '../../redux/selectors';
import AppointmentDateTime from '../AppointmentDateTime';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import FacilityPhone from '../../../components/FacilityPhone';

function getHeading(appointment) {
  if (selectIsInPerson(appointment)) {
    if (selectIsCanceled(appointment)) return 'Canceled in-person appointment';
    return 'In-person appointment';
  }

  return 'not defined yet';
}

export default function CancelPageLayout() {
  const { id } = useParams();
  const {
    appointment,
    bookingNotes,
    facility,
    facilityId,
    facilityPhone,
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
      <h2 className="vads-u-font-size--h3">{heading}</h2>
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">When</h3>
      <AppointmentDateTime appointment={appointment} />

      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">What</h3>
      {typeOfCareName || 'Type of care information not available'}

      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">Who</h3>
      {provider || 'Provider information not available'}
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">Where</h3>
      <VAFacilityLocation
        facility={facility}
        facilityName={facility?.name}
        facilityId={facilityId}
        isPhone={false}
        showPhone={false}
      />
      <br />
      <span>Clinic: Not available</span>
      <br />
      <span>Location: Not available</span>
      <br />
      <span>
        <FacilityPhone contact={facilityPhone} heading="Clinic phone:" />
      </span>

      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
        Details you share with your provider
      </h3>
      <span>
        Reason: {`${reason && reason !== 'none' ? reason : 'Not noted'}`}
      </span>
      <br />
      <span>Other details: {`${otherDetails || 'Not noted'}`}</span>
    </>
  );
}
