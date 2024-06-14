import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
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
    title =
      'We’re sorry. We couldn’t find any available slots for your appointment.';
    content = (
      <div>
        Please{' '}
        {facilityDetails && (
          <>
            call your medical facility:
            <br />
            <FacilityAddress
              name={facilityDetails.name}
              facility={facilityDetails}
              showCovidPhone
              level={2}
            />
          </>
        )}
        {!facilityDetails && <>call your medical facility</>}
      </div>
    );
  }

  return (
    <VaModal
      id="eligibilityModal"
      status="warning"
      visible
      onCloseEvent={onClose}
      hideCloseButton={status === FETCH_STATUS.loading}
      modalTitle={title}
      ariaLabel={title}
      data-testid="eligibilityModal"
      role="alertdialog"
      uswds
    >
      <div aria-atomic="true" aria-live="assertive">
        {content}
      </div>
    </VaModal>
  );
}
EligibilityModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  clinicsStatus: PropTypes.string,
  facilityDetails: PropTypes.object,
};
