import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import NewTabAnchor from '../../../components/NewTabAnchor';
import FacilityPhone from '../../../components/FacilityPhone';

export default function CancelCommunityCareAppointmentModal({
  onClose,
  appointment,
}) {
  const provider = appointment.communityCareProvider;
  const phone = provider.telecom?.find(item => item.system === 'phone')?.value;
  const { address } = provider;

  const title = provider.address
    ? 'You need to call your community care provider to cancel this appointment'
    : 'You need to call your community care staff at your local VA facility to cancel this appointment';

  return (
    <VaModal
      id="cancelAppt"
      status="warning"
      visible
      onCloseEvent={onClose}
      modalTitle={title}
      role="alertdialog"
    >
      Community care appointments can’t be canceled online.{' '}
      {!address && (
        <>
          Please contact your facility community care staff at{' '}
          <NewTabAnchor href="/find-locations">your local VA.</NewTabAnchor>
          <br />
        </>
      )}
      {!!address && (
        <>
          Please call the below provider to cancel your appointment.
          <br />
        </>
      )}
      <div className="vads-u-margin-y--2">
        {!!provider.providerName && (
          <>
            {provider.providerName}
            <br />
          </>
        )}
        <strong>{provider.practiceName}</strong>
        {!!phone && (
          <>
            <br />
            <FacilityPhone contact={phone} level={4} />
          </>
        )}
      </div>
      <button type="button" onClick={onClose}>
        OK
      </button>
    </VaModal>
  );
}
CancelCommunityCareAppointmentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  appointment: PropTypes.object,
};
