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
    <div className="vads-u-margin-top--2">
      <EditContentListOrSignatureModal
        editListModal={editListModal}
        onClose={() => {
          handleModalClose();
        }}
      />

      <button
        ref={editPreferencesButtonRef}
        id="edit-preferences-button"
        data-testid="edit-preferences-button"
        data-dd-action-name="Edit Preferences Button"
        label="Edit preferences"
        className="edit-preferences-button vads-u-flex--1  vads-u-margin-top--2 vads-u-margin-bottom--0 vads-u-background-color--transparent hydrated vads-u-width--full small-screen:vads-u-width--auto"
        onClick={() => setEditListModal(true)}
        type="button"
      >
        <div className="vads-u-display--flex vads-u-flex-direction-row vads-u-justify-content--center">
          <div className="vads-u-padding-right--0p5">
            <va-icon icon="settings" aria-hidden />
          </div>
          Edit preferences
        </div>
      </button>
    </div>
  );
};

export default EditPreferences;
