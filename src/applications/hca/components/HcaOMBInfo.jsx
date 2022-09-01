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
    <>
      <dl className="omb-info vads-u-margin-y--0">
        <div className="vads-l-row">
          <dt className="vads-u-flex--auto vads-u-margin-right--0p5">
            How much time we think you’ll need to apply (called respondent
            burden):
          </dt>
          <dd className="vads-u-font-weight--bold">30 minutes</dd>
        </div>
        <div className="vads-l-row">
          <dt className="vads-u-flex--auto vads-u-margin-right--0p5">
            OMB Control #:
          </dt>
          <dd className="vads-u-font-weight--bold">2900-0091</dd>
        </div>
        <div className="vads-l-row">
          <dt className="vads-u-flex--auto vads-u-margin-right--0p5">
            Expiration date:
          </dt>
          <dd className="vads-u-font-weight--bold">06/30/2024</dd>
        </div>
      </dl>

      <button type="button" className="va-button-link" onClick={openModal}>
        Privacy Act Statement
      </button>

      <VaModal
        id="omb-modal"
        visible={modalOpen}
        onCloseEvent={closeModal}
        clickToClose
      >
        <HCAPrivacyActStatement />
      </VaModal>
    </>
  );
};

export default HcaOMBInfo;
