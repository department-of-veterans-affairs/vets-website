import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export default function CancelAppointmentSucceededModal({
  isConfirmed,
  onClose,
}) {
  const typeText = isConfirmed ? 'appointment' : 'request';
  return (
    <>
      <VaModal
        id="cancelAppt"
        status="success"
        visible
        onCloseEvent={onClose}
        modalTitle={`Your ${typeText} has been canceled`}
        data-testid={`cancel-${typeText}-SuccessModal`}
        role="alertdialog"
      >
        {isConfirmed
          ? `If you want to reschedule, call us or schedule a new ${typeText} online.`
          : `If you still need an appointment, call us or request a new appointment online.`}
        <p className="vads-u-margin-top--2">
          <button type="button" onClick={onClose}>
            Continue
          </button>
        </p>
      </VaModal>
    </>
  );
}

CancelAppointmentSucceededModal.propTypes = {
  isConfirmed: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
