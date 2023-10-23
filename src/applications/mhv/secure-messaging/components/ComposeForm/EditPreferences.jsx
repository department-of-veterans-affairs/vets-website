import React, { useCallback, useRef, useState } from 'react';
import { focusElement } from '@department-of-veterans-affairs/platform-utilities/ui';
import EditContentListOrSignatureModal from '../Modals/EditContentListOrSignatureModal';

const EditPreferences = () => {
  const [editListModal, setEditListModal] = useState(false);
  const editPreferencesButtonRef = useRef();
  const handleModalClose = useCallback(() => {
    focusElement(editPreferencesButtonRef.current);
    setEditListModal(false);
  }, []);
  return (
    <>
      <EditContentListOrSignatureModal
        editListModal={editListModal}
        setEditListModal={setEditListModal}
        onClose={() => {
          handleModalClose();
        }}
      />
      <div className="edit-contact-list-or-signature">
        <button
          ref={editPreferencesButtonRef}
          id="edit-contact-list-or-signature-button"
          label="Edit preferences"
          className="edit-contact-list-or-signature-button vads-u-flex--1  vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-background-color--transparent hydrated vads-u-width--full small-screen:vads-u-width--auto"
          data-testid="edit-list-button"
          onClick={() => setEditListModal(true)}
          type="button"
        >
          <i className="fas fa-cog vads-u-padding-right--0p5" />
          Edit preferences
        </button>
      </div>
    </>
  );
};

export default EditPreferences;
