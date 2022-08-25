import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { getCernerURL } from 'platform/utilities/cerner';
import PropTypes from 'prop-types';
import { FETCH_STATUS } from '../../../utils/constants';

export default function CancelCernerAppointmentModal({ onClose, status }) {
  return (
    <VaModal
      id="cancelCernerAppt"
      status="warning"
      visible
      onCloseEvent={onClose}
      modalTitle="You can’t cancel this appointment on the VA appointments tool."
      role="alertdialog"
    >
      To cancel this appointment, please go to My VA Health.
      <p className="vads-u-margin-top--2">
        <button
          type="button"
          onClick={() => {
            window.open(getCernerURL('/pages/scheduling/upcoming'));
            onClose();
          }}
        >
          Go to My VA Health
        </button>
        <button
          type="button"
          className="usa-button-secondary"
          onClick={onClose}
          disabled={status === FETCH_STATUS.loading}
        >
          Go back to VA appointments
        </button>
      </p>
    </VaModal>
  );
}
CancelCernerAppointmentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  status: PropTypes.string,
};
