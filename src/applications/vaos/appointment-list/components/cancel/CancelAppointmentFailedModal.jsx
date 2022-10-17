import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import PropTypes from 'prop-types';
import FacilityAddress from '../../../components/FacilityAddress';
import NewTabAnchor from '../../../components/NewTabAnchor';

export default function CancelAppointmentFailedModal({
  facility,
  isConfirmed,
  isBadRequest,
  onClose,
}) {
  const typeText = isConfirmed ? 'appointment' : 'request';
  return (
    <VaModal
      id="cancelAppt"
      status="error"
      visible
      onCloseEvent={onClose}
      modalTitle={`We couldn’t cancel your ${typeText}`}
      data-testid={`cancel-${typeText}-SuccessModal`}
      role="alertdialog"
    >
      {isBadRequest ? (
        <p>
          We’re sorry. You can’t cancel your {typeText} on the VA appointments
          tool. Please contact your local VA medical center to cancel this
          appointment:
        </p>
      ) : (
        <p>
          Something went wrong when we tried to cancel this {typeText}. Please
          contact your medical center to cancel:
        </p>
      )}
      <p>
        {facility ? (
          <>
            <strong>{facility.name}</strong>
            <br />
          </>
        ) : null}
        {!!facility && <FacilityAddress facility={facility} />}
        {!facility && (
          <>
            <NewTabAnchor href="/find-locations">
              Find facility contact information
            </NewTabAnchor>
          </>
        )}
      </p>
    </VaModal>
  );
}
CancelAppointmentFailedModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  facility: PropTypes.string,
  isBadRequest: PropTypes.bool,
  isConfirmed: PropTypes.bool,
};
