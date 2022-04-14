import React from 'react';
import { VaModal } from 'web-components/react-bindings';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import PropTypes from 'prop-types';

export default function CancelCOVIDVaccineModal({ onClose, facility }) {
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
      COVID-19 vaccine appointments can’t be canceled online. Please call the
      below VA facility to cancel your appointment.
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
            <Telephone contact={phone} />
          </>
        )}
      </p>
      <button type="button" onClick={onClose}>
        OK
      </button>
    </VaModal>
  );
}
CancelCOVIDVaccineModal.propTypes = {
  facility: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
