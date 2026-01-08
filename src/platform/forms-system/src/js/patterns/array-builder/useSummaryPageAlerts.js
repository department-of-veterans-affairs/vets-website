import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { scrollAndFocus } from 'platform/utilities/scroll';
import { focusElement } from 'platform/utilities/ui/focus';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { slugifyText } from './helpers';

// Module-level storage to persist max items alert state across component mount/unmount
// Maps arrayPath to whether the alert has been seen
const maxItemsAlertSeenMap = {};

const SuccessAlert = ({ nounSingular, index, onDismiss, text }) => (
  <div className="vads-u-margin-top--2">
    <VaAlert
      onCloseEvent={onDismiss}
      slim
      closeable
      name={`${slugifyText(nounSingular)}_${index}`}
      status="success"
      closeBtnAriaLabel="Close notification"
      uswds
    >
      <div className="dd-privacy-mask" data-dd-action-name="Success Alert">
        {text}
      </div>
    </VaAlert>
  </div>
);

const MaxItemsAlert = forwardRef(
  ({ children, show }, ref) =>
    show ? (
      <div className="vads-u-margin-top--4">
        <va-alert slim status="warning" tabIndex={-1} visible ref={ref}>
          <p className="vads-u-margin-y--0 vads-u-font-weight--normal">
            {children}
          </p>
        </va-alert>
      </div>
    ) : null,
);

SuccessAlert.propTypes = {
  index: PropTypes.number,
  nounSingular: PropTypes.string,
  text: PropTypes.string,
  onDismiss: PropTypes.func,
};

MaxItemsAlert.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool,
};

function getYesNoReviewErrorMessage(reviewErrors, hasItemsKey) {
  // use the same error message as the yes/no field
  const error =
    hasItemsKey && reviewErrors?.errors?.find(obj => obj.name === hasItemsKey);
  return error?.message;
}

/**
 * Custom hook for managing alerts in ArrayBuilderSummaryPage.
 * Fully encapsulates alert rendering, state, refs, and focus management.
 *
 * @param {Object} options
 * @param {ArrayBuilderOptions} options.arrayBuilderOptions - Array builder configuration
 * @param {CustomPageProps} options.customPageProps - Custom page props
 * @param {boolean} options.hasReviewError - Whether there's a review error
 * @param {boolean} options.isMaxItemsReached - Whether max items have been reached
 * @param {number|null} options.updateItemIndex - Index of the updated item
 * @param {Object|null} options.updatedItemData - Data of the updated item
 * @param {Array} options.arrayData - The array data to check length for margin logic
 *
 * @returns {{
 *   renderAlerts: () => React.ReactElement,
 *   alertActions: {
 *     showRemovedAlert: (text: string, index: number) => void
 *   },
 *   alertsShown: boolean
 * }}
 */
export function useSummaryPageAlerts({
  arrayBuilderOptions,
  customPageProps,
  hasReviewError = false,
  isMaxItemsReached = false,
  updateItemIndex = null,
  updatedItemData = null,
  arrayData = null,
}) {
  const {
    getText,
    nounSingular,
    nounPlural,
    hasItemsKey,
    hideMaxItemsAlert,
    useLinkInsteadOfYesNo,
    useButtonInsteadOfYesNo,
    arrayPath,
  } = arrayBuilderOptions || {};

  const { data: formData, reviewErrors, recalculateErrors, name: pageName } =
    customPageProps || {};

  const showInitialUpdatedAlert = !!updatedItemData;
  // Alert state
  const [showUpdatedAlert, setShowUpdatedAlert] = useState(
    showInitialUpdatedAlert,
  );
  const [showRemovedAlert, setShowRemovedAlert] = useState(false);
  const [showReviewErrorAlert, setShowReviewErrorAlert] = useState(false);
  const [removedItemText, setRemovedItemText] = useState('');
  const [removedItemIndex, setRemovedItemIndex] = useState(null);

  // Refs for alert elements
  const updatedAlertRef = useRef(null);
  const removedAlertRef = useRef(null);
  const reviewErrorAlertRef = useRef(null);
  const maxItemsAlertRef = useRef(null);

  // Update showUpdatedAlert when updateItemIndex changes
  useEffect(
    () => {
      setShowUpdatedAlert(() => updateItemIndex != null);
    },
    [updateItemIndex],
  );

  // Handle focus management for alerts
  useEffect(
    () => {
      let timeout;
      let focusRef;

      if (
        showUpdatedAlert &&
        updateItemIndex != null &&
        updatedAlertRef.current
      ) {
        focusRef = updatedAlertRef;
      } else if (
        isMaxItemsReached &&
        !maxItemsAlertSeenMap[arrayPath] &&
        maxItemsAlertRef.current
      ) {
        focusRef = maxItemsAlertRef;
      }

      // Update persistent storage
      if (arrayPath) {
        maxItemsAlertSeenMap[arrayPath] = isMaxItemsReached;
      }

      if (focusRef) {
        timeout = setTimeout(() => {
          if (focusRef.current) {
            scrollAndFocus(focusRef.current);
          }
        }, 300); // need to wait to override pageScrollAndFocus
      }

      return () => timeout && clearTimeout(timeout);
    },
    [showUpdatedAlert, updateItemIndex, isMaxItemsReached, arrayPath],
  );

  // Handle review error state
  useEffect(
    () => {
      setShowReviewErrorAlert(hasReviewError);

      if (
        recalculateErrors &&
        pageName &&
        (showUpdatedAlert || showRemovedAlert)
      ) {
        // Affects the red highlighting at the chapter level and
        // error messages. This prop only exists on the review page.
        recalculateErrors(pageName);
      }
    },
    [
      hasReviewError,
      showUpdatedAlert,
      showRemovedAlert,
      recalculateErrors,
      pageName,
    ],
  );

  // Imperative handlers - memoized to prevent unnecessary re-renders
  const dismissUpdatedAlert = useCallback(
    () => {
      setShowUpdatedAlert(false);
      requestAnimationFrame(() => {
        focusElement(
          document.querySelector(
            `[data-title-for-noun-singular="${nounSingular}"]`,
          ),
        );
      });
    },
    [nounSingular],
  );

  const dismissRemovedAlert = useCallback(
    () => {
      setShowRemovedAlert(false);
      setRemovedItemText('');
      setRemovedItemIndex(null);
      requestAnimationFrame(() => {
        focusElement(
          document.querySelector(
            `[data-title-for-noun-singular="${nounSingular}"]`,
          ),
        );
      });
    },
    [nounSingular],
  );

  const showRemoved = useCallback((text, index) => {
    // updated alert may be from initial state (URL path)
    // so we can go ahead and remove it if there is a new alert
    setShowUpdatedAlert(false);
    setRemovedItemText(text);
    setRemovedItemIndex(index);
    setShowRemovedAlert(true);
    requestAnimationFrame(() => {
      focusElement(removedAlertRef.current);
    });
  }, []);

  const alertsShown =
    isMaxItemsReached ||
    showUpdatedAlert ||
    showRemovedAlert ||
    showReviewErrorAlert;

  // Calculate margin class for alerts wrapper
  const isButtonOrLink = useLinkInsteadOfYesNo || useButtonInsteadOfYesNo;
  const alertsClassName =
    alertsShown && isButtonOrLink && !arrayData?.length
      ? 'vads-u-margin-bottom--4'
      : '';

  const renderAlerts = useCallback(
    () => {
      const showMaxItemsAlert = isMaxItemsReached && !hideMaxItemsAlert;

      return (
        <div className={alertsClassName}>
          {showMaxItemsAlert && (
            <MaxItemsAlert show ref={maxItemsAlertRef}>
              {getText?.(
                'alertMaxItems',
                updatedItemData,
                formData,
                updateItemIndex,
              )}
            </MaxItemsAlert>
          )}
          {showRemovedAlert && (
            <div ref={removedAlertRef}>
              <SuccessAlert
                onDismiss={dismissRemovedAlert}
                nounSingular={nounSingular}
                index={removedItemIndex}
                text={removedItemText}
              />
            </div>
          )}
          {showUpdatedAlert && (
            <div ref={updatedAlertRef}>
              <SuccessAlert
                onDismiss={dismissUpdatedAlert}
                nounSingular={nounSingular}
                index={updateItemIndex}
                text={getText?.(
                  'alertItemUpdated',
                  updatedItemData,
                  formData,
                  updateItemIndex,
                )}
              />
            </div>
          )}
          {showReviewErrorAlert && (
            <div ref={reviewErrorAlertRef}>
              <div className="vads-u-margin-top--2">
                <VaAlert
                  status="error"
                  slim
                  tabIndex={0}
                  visible
                  name={`${nounPlural}ReviewError`}
                >
                  {getYesNoReviewErrorMessage(reviewErrors, hasItemsKey)}
                </VaAlert>
              </div>
            </div>
          )}
        </div>
      );
    },
    [
      alertsClassName,
      isMaxItemsReached,
      hideMaxItemsAlert,
      showRemovedAlert,
      showUpdatedAlert,
      showReviewErrorAlert,
      getText,
      updatedItemData,
      formData,
      updateItemIndex,
      dismissRemovedAlert,
      dismissUpdatedAlert,
      nounSingular,
      nounPlural,
      removedItemIndex,
      removedItemText,
      reviewErrors,
      hasItemsKey,
    ],
  );

  const alertActions = useMemo(
    () => ({
      showRemovedAlert: showRemoved,
    }),
    [showRemoved],
  );

  return {
    renderAlerts,
    alertActions,
    alertsShown,
  };
}
