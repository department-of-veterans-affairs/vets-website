import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import { FETCH_STATUS } from '../../../utils/constants';
import { getCernerURL } from 'platform/utilities/cerner';

export default function CancelCernerAppointmentModal({ onClose, status }) {
  return (
    <Modal
      id="cancelCernerAppt"
      status="warning"
      visible
      onClose={onClose}
      title="You can’t cancel this appointment on the VA appointments tool."
    >
      To cancel this appointment, please go to My VA Health.
      <p className="vads-u-margin-top--2">
        <button
          onClick={() => {
            window.open(getCernerURL('/pages/scheduling/upcoming'));
            onClose();
          }}
        >
          Go to My VA Health
        </button>
        <button
          className="usa-button-secondary"
          onClick={onClose}
          disabled={status === FETCH_STATUS.loading}
        >
          Go back to VA appointments
        </button>
      </p>
    </Modal>
  );
}
