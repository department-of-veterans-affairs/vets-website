import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import getEligibilityMessage from './getEligibilityMessage';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function EligibilityModal({
  onClose,
  eligibility,
  facilityDetails,
  typeOfCare,
}) {
  const { title, content, status = 'warning' } = getEligibilityMessage({
    eligibility,
    facilityDetails,
    typeOfCare,
    includeFacilityContactInfo: true,
  });

  return (
    <VaModal
      id="eligibilityModal"
      status={status}
      visible
      onCloseEvent={onClose}
      modalTitle={title}
      ariaLabel={title}
      data-testid="eligibilityModal"
      role="alertdialog"
      uswds
    >
      <div aria-atomic="true" aria-live="assertive">
        <p>{content}</p>
        {status === 'error' && (
          <p>
            If you need to schedule now, call your VA facility.
            <br />
            <NewTabAnchor href="/find-locations">
              Find a VA health facility
            </NewTabAnchor>
          </p>
        )}
      </div>
    </VaModal>
  );
}
EligibilityModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  eligibility: PropTypes.object,
  facilityDetails: PropTypes.object,
  typeOfCare: PropTypes.object,
};
