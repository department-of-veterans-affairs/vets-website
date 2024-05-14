import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import LoadingButton from '@department-of-veterans-affairs/platform-site-wide/LoadingButton';
import { FETCH_STATUS } from '../../../utils/constants';

function getAlertText(isConfirmed) {
  if (isConfirmed) {
    return {
      alertTitle: 'Are you sure you want to cancel your appointment',
      alertText:
        'If you want to reschedule, you’ll need to call us or schedule a new appointment online.',
    };
  }
  return {
    alertTitle:
      'Are you sure you want to cancel your request for an appointment',
    alertText:
      'If you still need an appointment, you’ll need to call us or schedule a new appointment online.',
  };
}
export default function CancelAppointmentConfirmationModal({
  isConfirmed,
  onClose,
  onConfirm,
  status,
}) {
  const typeText = isConfirmed ? 'appointment' : 'request';
  const { alertText, alertTitle } = getAlertText(isConfirmed);
  return (
    <VaModal
      id="cancelAppt"
      status="warning"
      visible
      onCloseEvent={onClose}
      hideCloseButton={status === FETCH_STATUS.loading}
      modalTitle={alertTitle}
      role="alertdialog"
      uswds
    >
      {alertText}
      <p className="vads-u-margin-top--2">
        <LoadingButton
          isLoading={status === FETCH_STATUS.loading}
          loadingText={`Canceling ${typeText}`}
          onClick={onConfirm}
        >
          Yes, cancel this {typeText}
        </LoadingButton>
        <va-button
          text="No, don't cancel"
          secondary
          onClick={onClose}
          disabled={status === FETCH_STATUS.loading}
          uswds
        />
      </p>
    </VaModal>
  );
}

CancelAppointmentConfirmationModal.propTypes = {
  status: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isConfirmed: PropTypes.bool,
  onConfirm: PropTypes.func,
};
