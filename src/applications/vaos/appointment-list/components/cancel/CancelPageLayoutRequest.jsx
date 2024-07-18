import { VaTelephone } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { shallowEqual } from 'recompose';
import FacilityPhone from '../../../components/FacilityPhone';
import VAFacilityLocation from '../../../components/VAFacilityLocation';
import { selectRequestedAppointmentDetails } from '../../redux/selectors';
import ListBestTimeToCall from '../ListBestTimeToCall';
import { TIME_TEXT } from '../../../utils/appointment';

export default function CancelPageLayoutRequest() {
  const { id } = useParams();
  const {
    bookingNotes,
    email,
    facility,
    facilityId,
    facilityPhone,
    isCC,
    phone,
    preferredDates,
    preferredLanguage,
    preferredTimesForPhoneCall,
    provider: preferredProvider,
    typeOfCareName,
    typeOfVisit,
  } = useSelector(
    state => selectRequestedAppointmentDetails(state, id),
    shallowEqual,
  );
  let [reason, otherDetails] = bookingNotes.split(':');
  if (isCC) {
    reason = null;
    otherDetails = bookingNotes;
  }

  return (
    <>
      <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">
        {`Request for ${isCC ? 'community care appointment' : 'appointment'}`}
      </h2>
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
        Preferred date and time
      </h3>
      <ul className="usa-unstyled-list">
        {preferredDates.map((option, optionIndex) => (
          <li key={`${id}-option-${optionIndex}`}>
            {moment(option.start).format('ddd, MMMM D, YYYY')}{' '}
            {moment(option.start).hour() < 12 ? TIME_TEXT.AM : TIME_TEXT.PM}
          </li>
        ))}
      </ul>
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
        Type of care
      </h3>
      {typeOfCareName}
      {isCC && (
        <>
          <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
            Scheduling facility
          </h3>
          <span>{facility?.name}</span>
          <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
            Preferred community care provider
          </h3>
          {preferredProvider?.providerName ||
            'Provider information not available'}
          <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
            Language you’d prefer the provider speak
          </h3>
          {preferredLanguage}
        </>
      )}
      {!isCC && (
        <>
          <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
            How you prefer to attend
          </h3>
          {typeOfVisit}
          <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
            Facility
          </h3>
          <VAFacilityLocation
            facility={facility}
            facilityName={facility?.name}
            facilityId={facilityId}
            isPhone={false}
            showPhone={false}
            showDirectionsLink={false}
          />
          <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
            Phone
          </h3>
          <FacilityPhone contact={facilityPhone} icon />
        </>
      )}

      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
        Details you’d like to share with your provider
      </h3>
      <span>
        Reason: {`${reason && reason !== 'none' ? reason : 'Not available'}`}
      </span>
      <br />
      <span>Other details: {`${otherDetails || 'Not available'}`}</span>
      <h3 className="vads-u-font-size--h5 vads-u-margin-bottom--0">
        Your contact details
      </h3>
      <span>Email: </span>
      <span data-dd-privacy="mask">{email}</span>
      <br />
      <span>Phone number: </span>
      <VaTelephone
        data-dd-privacy="mask"
        notClickable
        contact={phone}
        data-testid="patient-telephone"
      />
      <br />
      {isCC && <ListBestTimeToCall timesToCall={preferredTimesForPhoneCall} />}
    </>
  );
}
