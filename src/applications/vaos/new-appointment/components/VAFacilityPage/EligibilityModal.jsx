import React from 'react';
import { Link } from 'react-router-dom';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import { FETCH_STATUS } from '../../../utils/constants';
import FacilityAddress from '../../../components/FacilityAddress';

export default function EligibilityModal({
  onClose,
  eligibility,
  facilityDetails,
}) {
  let title;
  let content;

  if (eligibility.requestFailed) {
    title = 'We’re sorry. We’ve run into a problem';
    content = 'Something went wrong on our end. Please try again later.';
  } else if (!eligibility.requestSupported) {
    title =
      'This facility does not allow online requests for this type of care';
    content = (
      <div aria-atomic="true" aria-live="assertive">
        This facility does not allow scheduling requests for this type of care
        to be made online. Not all facilities support online scheduling for all
        types of care.
      </div>
    );
  } else if (!eligibility.requestPastVisit) {
    title = 'We couldn’t find a recent appointment at this location';
    content = (
      <>
        <p>
          You need to have visited this facility within the past{' '}
          {eligibility.requestPastVisitValue} months to request an appointment
          online for the type of care you selected.
        </p>
        <p>
          If you haven’t visited this location within the past{' '}
          {eligibility.requestPastVisitValue} months, please call this facility
          to schedule your appointment or search for another facility.
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
