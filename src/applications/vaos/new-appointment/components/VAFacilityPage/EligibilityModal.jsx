import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { FETCH_STATUS } from '../../../utils/constants';
import FacilityAddress from '../../../components/FacilityAddress';
import { lowerCase } from '../../../utils/formatters';
import NewTabAnchor from '../../../components/NewTabAnchor';

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
          You need to have visited this facility within the past{' '}
          {eligibility.requestPastVisitValue} months for {lowerCase(typeOfCare)}{' '}
          to request an appointment for this type of care.
        </p>
        <p>
          You’ll need to call the facility to schedule this appointment. Or{' '}
          <NewTabAnchor href="/find-locations">
            search for another VA facility
          </NewTabAnchor>
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
