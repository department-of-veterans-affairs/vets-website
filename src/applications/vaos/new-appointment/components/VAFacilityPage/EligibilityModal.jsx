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
    title =
      'You’ve reached the limit for appointment requests at this location';
    content = (
      <>
        <p>
          Our records show that you have an open appointment request at this
          location. We can’t schedule any more appointments at this facility
          until your open requests are scheduled or canceled. To schedule or
          cancel your open appointments:
        </p>
        <ul>
          <li>
            Go to <Link to="/">your appointment list</Link> and cancel open
            requests, or
          </li>
          {facilityDetails && (
            <li>
              Call your medical facility:
              <br />
              <FacilityAddress
                name={facilityDetails.name}
                facility={facilityDetails}
              />
            </li>
          )}
          {!facilityDetails && <li>Call your medical facility</li>}
        </ul>
      </>
    );
  }

  return (
    <Modal
      id="cancelAppt"
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
