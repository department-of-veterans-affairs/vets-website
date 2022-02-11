import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import PropTypes from 'prop-types';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
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
    <Modal
      id="cancelAppt"
      status="warning"
      visible
      onClose={onClose}
      hideCloseButton={status === FETCH_STATUS.loading}
      title={alertTitle}
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
        <button
          type="button"
          className="usa-button-secondary"
          onClick={onClose}
          disabled={status === FETCH_STATUS.loading}
        >
          No, don’t cancel
        </button>
      </p>
    </Modal>
  );
}

CancelAppointmentConfirmationModal.propTypes = {
  status: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  isConfirmed: PropTypes.bool,
  onConfirm: PropTypes.bool,
};
