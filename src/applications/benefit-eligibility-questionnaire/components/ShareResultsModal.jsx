import React, { useState } from 'react';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ShareResultsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = open => {
    setIsOpen(open);
  };

  const handleCopyClick = () => {};

  return (
    <>
      <va-button
        message-aria-describedby="Share your results"
        text="Share your results"
        onClick={() => toggleModal(true)}
      />
      <VaModal
        className="share-results-modal"
        onCloseEvent={() => toggleModal(false)}
        modalTitle="Save, bookmark, or share your results"
        initialFocusSelector="#va-modal-title"
        visible={isOpen}
        uswds
      >
        <p>Save, bookmark, or share your results</p>
        <input
          id="url-input"
          name="url-input"
          type="text"
          value="url goes here"
        />
        <button className="usa-button-primary" onClick={handleCopyClick} />
      </VaModal>
    </>
  );
};

export default ShareResultsModal;
