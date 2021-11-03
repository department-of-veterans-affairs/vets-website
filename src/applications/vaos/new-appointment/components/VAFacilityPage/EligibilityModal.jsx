import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { FETCH_STATUS } from '../../../utils/constants';
import getEligibilityMessage from './getEligibilityMessage';

export default function EligibilityModal({
  onClose,
  eligibility,
  facilityDetails,
  typeOfCare,
}) {
  const { title, content } = getEligibilityMessage({
    eligibility,
    facilityDetails,
    typeOfCare,
    includeFacilityContactInfo: true,
  });

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
