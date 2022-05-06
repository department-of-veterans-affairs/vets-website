import React from 'react';
import { VaModal, VaTelephone } from 'web-components/react-bindings';
import PropTypes from 'prop-types';

export default function CancelVideoAppointmentModal({ onClose, facility }) {
  const phone = facility?.telecom?.find(tele => tele.system === 'phone').value;
  return (
    <VaModal
      id="cancelAppt"
      status="warning"
      visible
      onCloseEvent={onClose}
      modalTitle="You need to call your VA medical center to cancel this appointment"
      role="alertdialog"
    >
      VA Video Connect appointments can’t be canceled online.{' '}
      {!facility &&
        'To reschedule or cancel this appointment, contact the VA facility where you scheduled it.'}
      {!!facility && (
        <>
          Please call the below VA facility to cancel your appointment.
          <p className="vads-u-margin-top--2">
            {facility ? (
              <>
                {facility.name}
                <br />
              </>
            ) : null}
            {!!phone && (
              <>
                <h4 className="vaos-appts__block-label vads-u-display--inline">
                  Main phone:
                </h4>{' '}
                <VaTelephone contact={phone} data-testid="facility-telephone" />
              </>
            )}
          </p>
          <button type="button" onClick={onClose}>
            OK
          </button>
        </>
      )}
    </VaModal>
  );
}
CancelVideoAppointmentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  facility: PropTypes.object,
};
