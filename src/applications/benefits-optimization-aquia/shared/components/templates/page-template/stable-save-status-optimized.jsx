/**
 * Performance-optimized version of StableSaveStatus with memoization
 *
 * This component provides the same anti-flicker save status functionality
 * but with added performance optimizations including:
 * - React.memo for preventing unnecessary re-renders
 * - Memoized computed values
 * - Optimized dependency arrays
 *
 * @module components/templates/page-template/stable-save-status-optimized
 */

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
import PropTypes from 'prop-types';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { CSS_CLASSES, DATE_FORMAT, ERROR_MESSAGES } from './constants';
import { StableSaveStatusPropTypes } from './prop-types';

/**
 * Memoized success alert component
 */
const SuccessAlert = memo(
  ({ appSavedSuccessfullyMessage, savedAtMessage, formIdMessage }) => (
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
  ),
);

SuccessAlert.displayName = 'SuccessAlert';

SuccessAlert.propTypes = {
  appSavedSuccessfullyMessage: PropTypes.string.isRequired,
  savedAtMessage: PropTypes.string.isRequired,
  formIdMessage: PropTypes.node,
};

/**
 * Memoized error alert component
 */
const ErrorAlert = memo(
  ({
    autoSavedStatus,
    appType,
    isLoggedIn,
    showLoginModal,
    toggleLoginModal,
  }) => {
    const errorContent = useMemo(
      () => {
        switch (autoSavedStatus) {
          case SAVE_STATUSES.clientFailure:
            return ERROR_MESSAGES.CLIENT_FAILURE(appType);

          case SAVE_STATUSES.failure:
            return ERROR_MESSAGES.SERVER_FAILURE(appType);

          case SAVE_STATUSES.noAuth:
            if (!isLoggedIn) {
              return (
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
              );
            }
            return null;

          default:
            return null;
        }
      },
      [autoSavedStatus, appType, isLoggedIn, showLoginModal, toggleLoginModal],
    );

    if (!errorContent) {
      return null;
    }

    return (
      <va-alert
        status="error"
        role="alert"
        class={CSS_CLASSES.SAVE_ERROR}
        slim
        uswds
      >
        {errorContent}
      </va-alert>
    );
  },
);

ErrorAlert.displayName = 'ErrorAlert';

ErrorAlert.propTypes = {
  appType: PropTypes.string.isRequired,
  autoSavedStatus: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  showLoginModal: PropTypes.bool,
  toggleLoginModal: PropTypes.func.isRequired,
};

/**
 * Optimized StableSaveStatus component with performance improvements
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
function StableSaveStatusOptimized({
  form,
  formConfig,
  isLoggedIn,
  showLoginModal,
  toggleLoginModal,
}) {
  // Extract form state values with defaults
  const {
    lastSavedDate,
    autoSavedStatus = SAVE_STATUSES.notAttempted,
    loadedData,
    inProgressFormId: formInProgressId,
  } = form || {};

  // Memoize form ID extraction
  const inProgressFormId = useMemo(
    () => formInProgressId || loadedData?.metadata?.inProgressFormId,
    [formInProgressId, loadedData?.metadata?.inProgressFormId],
  );

  // State for tracking save progress
  const [hasSeenPending, setHasSeenPending] = useState(false);
  const [lastSuccessDate, setLastSuccessDate] = useState(null);
  const [lastFormId, setLastFormId] = useState(null);

  // Monitor save status changes
  useEffect(
    () => {
      // Mark that we've seen a pending status
      if (autoSavedStatus === SAVE_STATUSES.pending) {
        setHasSeenPending(true);
      }

      // Capture save metadata when save succeeds
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

  // Memoize saved date/time message
  const savedAtMessage = useMemo(
    () => {
      if (!lastSuccessDate) {
        return '';
      }
      const savedAt = new Date(lastSuccessDate);
      return ` We saved it on ${format(savedAt, DATE_FORMAT.SAVED_AT)}`;
    },
    [lastSuccessDate],
  );

  // Memoize app type
  const appType = useMemo(
    () => formConfig?.customText?.appType || APP_TYPE_DEFAULT,
    [formConfig?.customText?.appType],
  );

  // Memoize form ID message
  const formIdMessage = useMemo(
    () => {
      if (!lastFormId || !savedAtMessage) {
        return null;
      }
      return (
        <>
          {' '}
          Your {appType} ID number is <strong>{lastFormId}</strong>.
        </>
      );
    },
    [lastFormId, savedAtMessage, appType],
  );

  // Memoize error status check
  const hasError = useMemo(
    () =>
      saveErrors.has(autoSavedStatus) &&
      ((autoSavedStatus === SAVE_STATUSES.noAuth && !isLoggedIn) ||
        autoSavedStatus !== SAVE_STATUSES.noAuth),
    [autoSavedStatus, isLoggedIn],
  );

  // Memoize success message
  const appSavedSuccessfullyMessage = useMemo(
    () =>
      formConfig?.customText?.appSavedSuccessfullyMessage ||
      APP_SAVED_SUCCESSFULLY_DEFAULT_MESSAGE,
    [formConfig?.customText?.appSavedSuccessfullyMessage],
  );

  // Memoize success visibility
  const showSuccess = useMemo(
    () =>
      hasSeenPending &&
      lastSuccessDate &&
      (autoSavedStatus === SAVE_STATUSES.success ||
        autoSavedStatus === SAVE_STATUSES.pending),
    [hasSeenPending, lastSuccessDate, autoSavedStatus],
  );

  // Memoize toggle login modal callback
  const handleToggleLoginModal = useCallback(
    () => {
      if (toggleLoginModal) {
        toggleLoginModal();
      }
    },
    [toggleLoginModal],
  );

  return (
    <div>
      {/* Success Alert */}
      {showSuccess && (
        <SuccessAlert
          appSavedSuccessfullyMessage={appSavedSuccessfullyMessage}
          savedAtMessage={savedAtMessage}
          formIdMessage={formIdMessage}
        />
      )}

      {/* Saving Indicator */}
      {autoSavedStatus === SAVE_STATUSES.pending &&
        !hasSeenPending && (
          <p className={CSS_CLASSES.SAVE_AUTOSAVING}>Saving...</p>
        )}

      {/* Error Alert */}
      {hasError && (
        <ErrorAlert
          autoSavedStatus={autoSavedStatus}
          appType={appType}
          isLoggedIn={isLoggedIn}
          showLoginModal={showLoginModal}
          toggleLoginModal={handleToggleLoginModal}
        />
      )}
    </div>
  );
}

StableSaveStatusOptimized.propTypes = StableSaveStatusPropTypes;

/**
 * Memoized version that prevents re-renders unless props actually change
 * This is the main export that should be used in production
 */
const MemoizedStableSaveStatus = memo(
  StableSaveStatusOptimized,
  (prevProps, nextProps) => {
    // Custom comparison function for optimal performance
    // Only re-render if relevant props have changed
    return (
      prevProps.form?.autoSavedStatus === nextProps.form?.autoSavedStatus &&
      prevProps.form?.lastSavedDate === nextProps.form?.lastSavedDate &&
      prevProps.form?.inProgressFormId === nextProps.form?.inProgressFormId &&
      prevProps.form?.loadedData?.metadata?.inProgressFormId ===
        nextProps.form?.loadedData?.metadata?.inProgressFormId &&
      prevProps.isLoggedIn === nextProps.isLoggedIn &&
      prevProps.showLoginModal === nextProps.showLoginModal &&
      prevProps.formConfig?.customText?.appType ===
        nextProps.formConfig?.customText?.appType &&
      prevProps.formConfig?.customText?.appSavedSuccessfullyMessage ===
        nextProps.formConfig?.customText?.appSavedSuccessfullyMessage
    );
  },
);

MemoizedStableSaveStatus.displayName = 'StableSaveStatusOptimized';

export default MemoizedStableSaveStatus;

// Export non-memoized version for testing
export { StableSaveStatusOptimized };

// Export sub-components for unit testing
export { ErrorAlert, SuccessAlert };
