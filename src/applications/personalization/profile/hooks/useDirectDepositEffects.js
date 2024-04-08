import { useEffect } from 'react';
import { DIRECT_DEPOSIT_ALERT_SETTINGS } from '../constants';

export const useDirectDepositEffects = ({
  wasSaving,
  wasEditing,
  hasSaveError,
  ui,
  setShowUpdateSuccess,
  setFormData,
  editButtonRef,
  cardHeadingId,
}) => {
  // effects to show then hide the success alert
  // and to clear form data after a successful save
  useEffect(
    () => {
      if (!ui.isSaving && !hasSaveError && wasSaving) {
        setShowUpdateSuccess(true);

        setTimeout(() => {
          setShowUpdateSuccess(false);
        }, DIRECT_DEPOSIT_ALERT_SETTINGS.TIMEOUT);

        setFormData({});
      }
    },
    [wasSaving, ui.isSaving, hasSaveError, setFormData, setShowUpdateSuccess],
  );

  // when editing is started
  // focus on the heading
  // clear update success alert if it's showing
  useEffect(
    () => {
      if (ui.isEditing && !wasEditing) {
        const heading = document.getElementById(cardHeadingId);
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({ focusVisible: true });
        }
        setShowUpdateSuccess(false);
      }
    },
    [cardHeadingId, ui.isEditing, wasEditing, setShowUpdateSuccess],
  );

  // focus on the edit button after leaving the update view
  useEffect(
    () => {
      if (wasEditing && !ui.isEditing && editButtonRef.current) {
        editButtonRef.current.focus();
      }
    },
    [wasEditing, ui.isEditing, editButtonRef],
  );
};
