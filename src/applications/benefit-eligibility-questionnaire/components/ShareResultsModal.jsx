import React, { useState } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ShareResultsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const currentUrl = window.location.href;
  const toggleModal = open => {
    setIsOpen(open);
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(currentUrl);
    setShowAlert(true);
  };

  return (
    <div>
      <va-button
        id="share-your-results"
        message-aria-describedby="Share your results"
        text="Share your results"
        onClick={() => toggleModal(true)}
      />
      <VaModal
        id="share-results-modal"
        onCloseEvent={() => {
          setShowAlert(false);
          toggleModal(false);
        }}
        modalTitle="Save, bookmark, or share your results"
        initialFocusSelector="#va-modal-title"
        visible={isOpen}
        uswds
        large
      >
        <p>Copy link</p>
        <input
          id="url-input"
          name="url-input"
          aria-label="URL"
          type="text"
          value={currentUrl}
          onChange={() => {}}
        />
        <button
          id="copy-button"
          className="usa-button-primary"
          onClick={handleCopyClick}
        >
          Copy
        </button>
        <va-alert
          id="copy-alert"
          close-btn-aria-label="Close notification"
          status="success"
          slim
          full-width
          visible={showAlert}
        >
          <p>URL has been copied to your clipboard.</p>
        </va-alert>
      </VaModal>
    </div>
  );
};

export default ShareResultsModal;
