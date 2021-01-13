import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import { FETCH_STATUS } from '../../../utils/constants';
import FacilityAddress from '../../../components/FacilityAddress';
import { aOrAn, lowerCase } from '../../../utils/formatters';

export default function EligibilityModal({
  onClose,
  eligibility,
  facilityDetails,
  typeOfCare,
}) {
  let title;
  let content;

  if (eligibility.requestFailed) {
    title = 'We’re sorry. We’ve run into a problem';
    content = 'Something went wrong on our end. Please try again later.';
  } else if (!eligibility.requestSupported) {
    title = 'This facility doesn’t accept online scheduling for this care';
    content = (
      <div aria-atomic="true" aria-live="assertive">
        You’ll need to call your VA health facility to schedule this
        appointment. Not all VA facilities offer online scheduling for all types
        of care
      </div>
    );
  } else if (!eligibility.requestPastVisit) {
    title = 'We can’t find a recent appointment for you';
    content = (
      <>
        <p>
          You need to have had {aOrAn(typeOfCare)} {lowerCase(typeOfCare)}{' '}
          appointment at this facility within the last{' '}
          {eligibility.requestPastVisitValue} months to request an appointment
          online for this care.
        </p>
        <p>
          You’ll need to call the facility to schedule this appointment. Or{' '}
          <a href="/find-locations" target="_blank" rel="noopener noreferrer">
            search for another VA facility
          </a>
          .
        </p>
      </>
    );
  } else if (!eligibility.requestLimit) {
    title = 'You’ve reached the limit for appointment requests';
    content = (
      <>
        <p>
          Our records show that you have an open appointment request at this
          location. You can’t request another appointment until you schedule or
          cancel your open requests.
        </p>
        <p>
          Call this facility to schedule or cancel an open appointment request.
          You can also cancel a request from{' '}
          <Link to="/">your appointment list</Link>.
        </p>
        {facilityDetails && (
          <FacilityAddress
            name={facilityDetails.name}
            facility={facilityDetails}
          />
        )}
      </>
    );
  }

  return (
    <Modal
      id="eligibilityModal"
      status="warning"
      visible
      onClose={onClose}
      hideCloseButton={status === FETCH_STATUS.loading}
      title={title}
    >
      <div aria-atomic="true" aria-live="assertive">
        {content}
      </div>
    </Modal>
  );
}
