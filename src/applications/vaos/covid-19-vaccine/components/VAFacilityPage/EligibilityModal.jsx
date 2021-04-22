import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { FETCH_STATUS } from '../../../utils/constants';
import FacilityAddress from '../../../components/FacilityAddress';

export default function EligibilityModal({
  onClose,
  clinicsStatus,
  facilityDetails,
}) {
  let title;
  let content;

  if (clinicsStatus === FETCH_STATUS.failed) {
    title = 'We’re sorry. We’ve run into a problem';
    content = 'Something went wrong on our end. Please try again later.';
  } else {
    title = 'Sorry, we could not find any available slots for your booking';
    content = (
      <div>
        We could not find any available slots for your booking. Please{' '}
        {facilityDetails && (
          <>
            call your medical facility:
            <br />
            <FacilityAddress
              name={facilityDetails.name}
              facility={facilityDetails}
            />
          </>
        )}
        {!facilityDetails && <>call your medical facility</>}
      </div>
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
