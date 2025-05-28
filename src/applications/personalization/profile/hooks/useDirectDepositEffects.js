import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { focusElement } from '~/platform/utilities/ui';
import { DIRECT_DEPOSIT_ALERT_SETTINGS } from '../constants';
import { toggleDirectDepositEdit } from '../actions/directDeposit';

export const useDirectDepositEffects = ({
  wasSaving,
  wasEditing,
  saveError,
  ui,
  setShowUpdateSuccess,
  setFormData,
  editButtonRef,
  cardHeadingId,
  hasUnsavedFormEdits,
}) => {
  const dispatch = useDispatch();

  // page setup effects
  // focus on the heading, set the document title,
  // clear edit state and remove any pending form data
  useEffect(
    () => {
      focusElement('[data-focus-target]');
      document.title = `Direct Deposit Information | Veterans Affairs`;
      dispatch(toggleDirectDepositEdit(false));
      setFormData({});
    },
    [dispatch, setFormData],
  );

  // effect to show an alert when the form is dirty and navigating away
  useEffect(
    () => {
      if (hasUnsavedFormEdits) {
        window.onbeforeunload = () => true;
        return;
      }
      window.onbeforeunload = undefined;
    },
    [hasUnsavedFormEdits],
  );

  // effects to show then hide the success alert
  // and to clear form data after a successful save
  useEffect(
    () => {
      if (!ui.isSaving && !saveError && wasSaving) {
        setShowUpdateSuccess(true);

        setTimeout(() => {
          setShowUpdateSuccess(false);
        }, DIRECT_DEPOSIT_ALERT_SETTINGS.TIMEOUT);

        setFormData({});
      }
    },
    [wasSaving, ui.isSaving, saveError, setFormData, setShowUpdateSuccess],
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
      if (wasEditing && !ui.isEditing) {
        focusElement('button', {}, editButtonRef.current);
      }
    },
    [wasEditing, ui.isEditing, editButtonRef],
  );
};
