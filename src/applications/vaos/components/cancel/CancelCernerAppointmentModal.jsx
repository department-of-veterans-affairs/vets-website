import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import { FETCH_STATUS } from '../../utils/constants';
import { getCernerPortalLink } from '../../utils/appointment';

export default function CancelCernerAppointmentModal({ onClose, status }) {
  return (
    <Modal
      id="cancelCernerAppt"
      status="warning"
      visible
      onClose={onClose}
      title="You cannot cancel this appointment here."
    >
      To cancel this appointment, sign in on My VA health.
      <p className="vads-u-margin-top--2">
        <button
          onClick={() => {
            window.open(getCernerPortalLink());
            onClose();
          }}
        >
          Yes, go to My VA Health
        </button>
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
