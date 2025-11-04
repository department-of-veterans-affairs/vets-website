import { format } from 'date-fns-tz';
import {
  APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE,
  APP_TYPE_DEFAULT,
} from 'platform/forms-system/src/js/constants';
import SignInLink from 'platform/forms/components/SignInLink';
import {
  SAVE_STATUSES,
  saveErrors,
} from 'platform/forms/save-in-progress/actions';
import React, { useEffect, useState } from 'react';
import { CSS_CLASSES, DATE_FORMAT, ERROR_MESSAGES } from './constants';
import { StableSaveStatusPropTypes } from './prop-types';

/**
 * Stable SaveStatus component that displays save-in-progress alerts without flickering.
 *
 * This component improves the user experience by:
 * - Preventing the success alert from flickering during auto-save cycles
 * - Only showing the alert after an actual save occurs (not on initial page load)
 * - Keeping the success message visible even when status changes to pending
 * - Displaying error messages for save failures
 *
 * The component tracks the 'pending' status to determine when a real save has occurred,
 * preventing the alert from showing when save-in-progress data is simply being loaded.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.form - Redux form state containing save status and metadata
 * @param {Object} props.formConfig - Form configuration with custom text
 * @param {boolean} props.isLoggedIn - Whether the user is currently logged in
 * @param {boolean} props.showLoginModal - Whether to show the login modal
 * @param {Function} props.toggleLoginModal - Function to toggle login modal visibility
 * @returns {JSX.Element} Save status alerts
 */
function StableSaveStatus({
  form,
  formConfig,
  isLoggedIn,
  showLoginModal,
  toggleLoginModal,
}) {
  // Extract form state values
  const {
    lastSavedDate,
    autoSavedStatus,
    loadedData,
    inProgressFormId: formInProgressId,
  } = form || {};

  // Get form ID from either direct prop or loaded metadata
  const inProgressFormId =
    formInProgressId || loadedData?.metadata?.inProgressFormId;

  /**
   * Track whether we've seen a 'pending' status during this session.
   * This is the key to preventing the alert from showing on initial page load.
   * The 'pending' status only occurs when an actual save is in progress,
   * not when save-in-progress data is being loaded.
   */
  const [hasSeenPending, setHasSeenPending] = useState(false);

  /**
   * Track the last successful save information to display in the alert.
   * These values persist even when status changes back to pending during
   * subsequent auto-saves, preventing the alert from flickering.
   */
  const [lastSuccessDate, setLastSuccessDate] = useState(null);
  const [lastFormId, setLastFormId] = useState(null);

  /**
   * Monitor save status changes and track successful saves.
   * This effect implements the anti-flicker logic by:
   * 1. Detecting when an actual save is happening (pending status)
   * 2. Capturing save metadata when the save completes successfully
   */
  useEffect(
    () => {
      // Step 1: Mark that we've seen a pending status (actual save in progress)
      if (autoSavedStatus === SAVE_STATUSES.pending) {
        setHasSeenPending(true);
      }

      // Step 2: When save succeeds AND we've confirmed a real save occurred,
      // capture the save metadata to display in the alert
      if (autoSavedStatus === SAVE_STATUSES.success && hasSeenPending) {
        if (lastSavedDate) {
          setLastSuccessDate(lastSavedDate);
        }
        if (inProgressFormId) {
          setLastFormId(inProgressFormId);
        }
      }
    },
    [autoSavedStatus, lastSavedDate, inProgressFormId, hasSeenPending],
  );

  // Build the saved date/time message
  let savedAtMessage;
  if (lastSuccessDate) {
    const savedAt = new Date(lastSuccessDate);
    savedAtMessage = ` We saved it on ${format(savedAt, DATE_FORMAT.SAVED_AT)}`;
  } else {
    savedAtMessage = '';
  }

  // Get custom app type text or use default
  const appType = formConfig?.customText?.appType || APP_TYPE_DEFAULT;

  // Build the form ID message (only shown if we have both ID and date)
  const formIdMessage =
    lastFormId && savedAtMessage ? (
      <>
        {' '}
        Your {appType} ID number is <strong>{lastFormId}</strong>.
      </>
    ) : null;

  // Determine if there's a save error to display
  const hasError =
    saveErrors.has(autoSavedStatus) &&
    ((autoSavedStatus === SAVE_STATUSES.noAuth && !isLoggedIn) ||
      autoSavedStatus !== SAVE_STATUSES.noAuth);

  // Get custom success message or use default
  const appSavedSuccessfullyMessage =
    formConfig?.customText?.appSavedSuccessfullyMessage ||
    APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE;

  /**
   * Determine if the success alert should be shown.
   * All three conditions must be true:
   * 1. We've seen a pending status (confirming a real save occurred)
   * 2. We have a last success date to display
   * 3. Current status is success OR pending (keeps alert visible during next auto-save)
   */
  const showSuccess =
    hasSeenPending &&
    lastSuccessDate &&
    (autoSavedStatus === SAVE_STATUSES.success ||
      autoSavedStatus === SAVE_STATUSES.pending);

  return (
    <div>
      {/* Success Alert: Shows after a save completes, stays visible during subsequent saves */}
      {showSuccess && (
        <div
          className={`${CSS_CLASSES.SAVE_SUCCESS_CONTAINER} ${
            CSS_CLASSES.DISPLAY_FLEX
          } ${CSS_CLASSES.PADDING_1} ${CSS_CLASSES.MARGIN_BOTTOM_1P5} ${
            CSS_CLASSES.DISPLAY_BLOCK
          }`}
        >
          <va-alert status="success" slim uswds>
            {appSavedSuccessfullyMessage}
            {savedAtMessage}
            {formIdMessage}
          </va-alert>
        </div>
      )}

      {/* Saving Indicator: Only shown during the very first save (before hasSeenPending is true) */}
      {autoSavedStatus === SAVE_STATUSES.pending &&
        !hasSeenPending && (
          <p className={CSS_CLASSES.SAVE_AUTOSAVING}>Saving...</p>
        )}

      {/* Error Alerts: Display when save fails for various reasons */}
      {hasError && (
        <va-alert
          status="error"
          role="alert"
          class={CSS_CLASSES.SAVE_ERROR}
          slim
          uswds
        >
          {/* Network connection error */}
          {autoSavedStatus === SAVE_STATUSES.clientFailure &&
            ERROR_MESSAGES.CLIENT_FAILURE(appType)}

          {/* Server error */}
          {autoSavedStatus === SAVE_STATUSES.failure &&
            ERROR_MESSAGES.SERVER_FAILURE(appType)}

          {/* Authentication error */}
          {!isLoggedIn &&
            autoSavedStatus === SAVE_STATUSES.noAuth && (
              <span>
                {ERROR_MESSAGES.NO_AUTH_PREFIX}{' '}
                <SignInLink
                  className="va-button-link"
                  isLoggedIn={isLoggedIn}
                  showLoginModal={showLoginModal}
                  toggleLoginModal={toggleLoginModal}
                >
                  {ERROR_MESSAGES.NO_AUTH_LINK_TEXT(appType)}
                </SignInLink>
                .
              </span>
            )}
        </va-alert>
      )}
    </div>
  );
}

StableSaveStatus.propTypes = StableSaveStatusPropTypes;

export default StableSaveStatus;
