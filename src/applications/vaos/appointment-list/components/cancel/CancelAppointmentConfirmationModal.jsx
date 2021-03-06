import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import LoadingButton from 'platform/site-wide/loading-button/LoadingButton';
import { FETCH_STATUS } from '../../../utils/constants';

export default function CancelAppointmentConfirmationModal({
  isConfirmed,
  onClose,
  onConfirm,
  status,
}) {
  const typeText = isConfirmed ? 'appointment' : 'request';
  return (
    <Modal
      id="cancelAppt"
      status="warning"
      visible
      onClose={onClose}
      hideCloseButton={status === FETCH_STATUS.loading}
      title={`Do you want to cancel your ${typeText}?`}
    >
      {isConfirmed && (
        <>
          If you want to reschedule this appointment, you’ll need to first
          cancel this one and then create a new appointment.
        </>
      )}
      <p className="vads-u-margin-top--2">
        <LoadingButton
          isLoading={status === FETCH_STATUS.loading}
          loadingText={`Canceling ${typeText}`}
          onClick={onConfirm}
        >
          Yes, cancel this {typeText}
        </LoadingButton>
        <button
          className="usa-button-secondary"
          onClick={onClose}
          disabled={status === FETCH_STATUS.loading}
        >
          No, take me back
        </button>
      </p>
    </Modal>
  );
}
