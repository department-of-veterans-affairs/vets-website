import React, { useState } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import HCAPrivacyActStatement from './HCAPrivacyActStatement';

const HcaOMBInfo = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="omb-info">
      <div>
        How much time we think you’ll need to apply (called respondent burden):{' '}
        <strong>30 minutes</strong>
      </div>
      <div>
        OMB Control #: <strong>2900-0091</strong>
      </div>
      <div>
        Expiration date: <strong>06/30/2024</strong>
      </div>
      <div>
        <button type="button" className="va-button-link" onClick={openModal}>
          Privacy Act Statement
        </button>
      </div>
      <VaModal
        id="omb-modal"
        visible={modalOpen}
        onCloseEvent={closeModal}
        clickToClose
      >
        <HCAPrivacyActStatement />
      </VaModal>
    </div>
  );
};

export default HcaOMBInfo;
