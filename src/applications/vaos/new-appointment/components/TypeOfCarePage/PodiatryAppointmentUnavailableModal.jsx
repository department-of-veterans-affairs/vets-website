import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import NewTabAnchor from '../../../components/NewTabAnchor';

const PodiatryAppointmentUnavailableModal = ({ onClose, showModal }) => {
  if (!showModal) {
    return null;
  }
  const title = 'You need to call your VA facility for a Podiatry appointment';

  return (
    <VaModal
      id="toc-modal"
      data-testid="toc-modal"
      status="warning"
      visible
      onCloseEvent={onClose}
      modalTitle={title}
      ariaLabel={title}
      role="alertdialog"
      primaryButtonText="Ok"
      onPrimaryButtonClick={onClose}
      uswds
    >
      You’re not eligible to request a community care Podiatry appointment
      online at this time. Please call your local VA medical center to schedule
      this appointment.
      <br />
      <NewTabAnchor href="/find-locations">
        Find your VA health facility’s phone number
      </NewTabAnchor>
    </VaModal>
  );
};

PodiatryAppointmentUnavailableModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
};

export default PodiatryAppointmentUnavailableModal;
