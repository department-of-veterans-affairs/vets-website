import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import FacilityPhone from '../../../components/FacilityPhone';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { selectRequestedAppointmentDetails } from '../../redux/selectors';

const TIME_TEXT = {
  AM: 'in the morning',
  PM: 'in the afternoon',
  'No Time Selected': '',
};

export default function CancelPageLayout() {
  const { id } = useParams();
  const {
    bookingNotes,
    email,
    facility,
    facilityId,
    isCC,
    phone,
    preferredDates,
    typeOfCareName,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );
  const [reason, otherDetails] = bookingNotes.split(':');

  return (
    <>
      <h2 className="vads-u-font-size--h3">Request for appointment</h2>
      <h3 className="vads-u-font-size--h5">Preferred date and time</h3>
      <ul className="usa-unstyled-list">
        {preferredDates.map((option, optionIndex) => (
          <li key={`${id}-option-${optionIndex}`}>
            {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
            {moment(option.start).hour() < 12 ? TIME_TEXT.AM : TIME_TEXT.PM}
          </li>
        ))}
      </ul>
      <h3 className="vads-u-font-size--h5">Type of care</h3>
      {typeOfCareName}
      <h3 className="vads-u-font-size--h5">Facility</h3>
      {!!facility &&
        !isCC && (
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={facilityId}
            isPhone={false}
            showPhone={false}
          />
        )}
      <h3 className="vads-u-font-size--h5">Phone</h3>
      <FacilityPhone contact={phone} icon />
      <h3 className="vads-u-font-size--h5">
        Details you share with your provider
      </h3>
      <span>Reason: {reason}</span>
      <br />
      <span>Other details: {otherDetails}</span>
      <h3 className="vads-u-font-size--h5">Your contact details</h3>
      <span>Email: </span>
      <span>{email}</span>
      <br />
      <span>Phone number: </span>
      <VaTelephone
        notClickable
        contact={phone}
        data-testid="patient-telephone"
      />
    </>
  );
}
