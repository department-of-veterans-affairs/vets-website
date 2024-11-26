import React, { useState } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const SaveResultsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const currentUrl = window.location.href;
  const toggleModal = open => {
    setIsOpen(open);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(currentUrl);
    setShowAlert(true);
    focusElement('#copy-alert');
  };

  const handleClose = () => {
    setShowAlert(false);
    toggleModal(false);
    focusElement('#save-your-results');
  };

  return (
    <div className="vads-u-margin-bottom--2">
      <va-button
        id="save-your-results"
        message-aria-describedby="Save your results"
        text="Save your results"
        onClick={() => toggleModal(true)}
      />
      <VaModal
        id="save-results-modal"
        onCloseEvent={handleClose}
        modalTitle="Save your results"
        initialFocusSelector="#va-modal-title"
        visible={isOpen}
        large
      >
        <va-text-input
          id="url-input"
          hint={null}
          aria-label="Copy and save this link to your results"
          label="Copy and save this link to your results"
          name="url-input"
          type="url"
          onChange={() => {}}
          value={currentUrl}
        />
        <va-button
          id="copy-button"
          className="usa-button-primary"
          onClick={handleCopyClick}
          text="Copy"
        />
        <va-alert
          id="copy-alert"
          close-btn-aria-label="Close notification"
          status="success"
          slim
          full-width
          visible={showAlert}
        >
          <p>Link copied</p>
        </va-alert>
      </VaModal>
    </div>
  );
};

export default SaveResultsModal;
