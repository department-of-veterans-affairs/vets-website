import React, { useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';
import {
  checkForDuplicatesInItemPages,
  getItemDuplicateDismissedName,
  META_DATA_KEY,
  defaultDuplicateResult,
} from './helpers';

/**
 * Custom hook for handling duplicate checks in array builder forms.
 * Provides duplicate checking logic and UI that can be optionally integrated
 * into your form submission workflow.
 *
 * @param {Object} config
 * @param {Object} config.arrayBuilderProps - Array builder configuration props
 * @param {Object} config.props - Component props from CustomPage
 * @param {boolean} config.isEdit - Whether in edit mode
 * @param {boolean} config.isAdd - Whether in add mode
 * @param {Function} config.onAccept - Callback when user accepts duplicate (receives item data)
 *
 * @returns {Object} Duplicate check utilities
 * @returns {boolean} return.isDuplicateCheckEnabled - Whether duplicate checking is enabled
 * @returns {Function} return.checkForDuplicate - Check if item data has duplicates (returns boolean)
 * @returns {Function} return.renderDuplicateModal - Render the duplicate warning modal (optional)
 */
export function useDuplicateChecks({
  arrayBuilderProps,
  props,
  isEdit = false,
  isAdd = false,
  onAccept,
}) {
  const {
    arrayPath,
    duplicateChecks: duplicateChecksGlobal = {},
    getText,
    required,
    summaryRoute,
    introRoute,
    reviewRoute,
    currentPath,
  } = arrayBuilderProps;

  const { fullData = {}, pagePerItemIndex, setFormData, goToPath } = props;

  // duplicateChecks will only apply to specific internal item pages
  const internalPageDuplicateChecks =
    duplicateChecksGlobal?.itemPathModalChecks?.[
      currentPath?.split(':index/')[1]
    ];
  const duplicateChecks = internalPageDuplicateChecks
    ? {
        ...duplicateChecksGlobal,
        // overwrite global with per-page settings
        ...internalPageDuplicateChecks,
      }
    : duplicateChecksGlobal || {};
  const [duplicateCheckResult, setDuplicateCheckResult] = useState(
    defaultDuplicateResult,
  );
  const [showDuplicateModal, setShowDuplicateModal] = useState(null);
  const [pendingSubmitData, setPendingSubmitData] = useState(null);

  const itemDuplicateDismissedName = getItemDuplicateDismissedName({
    arrayPath,
    duplicateChecks,
    fullData,
    itemIndex: pagePerItemIndex,
  });

  const isDuplicateCheckEnabled =
    duplicateChecks &&
    (duplicateChecks.externalComparisonData ||
      duplicateChecks.comparisons?.length > 0);

  const shouldShowDuplicateWarning =
    duplicateCheckResult?.duplicates.includes(
      duplicateCheckResult.arrayData[pagePerItemIndex],
    ) && !fullData?.[META_DATA_KEY]?.[itemDuplicateDismissedName];

  /**
   * Check if the given item data has duplicates
   * @param {Object} itemData - The item data to check
   * @returns {boolean} - True if duplicate found and not dismissed
   */
  const checkForDuplicate = itemData => {
    if (!isDuplicateCheckEnabled) {
      return false;
    }

    const check = checkForDuplicatesInItemPages({
      arrayPath,
      duplicateChecks,
      fullData,
      index: pagePerItemIndex,
      itemData,
    });
    setDuplicateCheckResult(check);

    const hasDuplicate =
      !fullData?.[META_DATA_KEY]?.[itemDuplicateDismissedName] &&
      check.duplicates.includes(check.arrayData[pagePerItemIndex]);

    if (hasDuplicate) {
      setPendingSubmitData(itemData);
      setShowDuplicateModal(true);
      dataDogLogger({
        message: 'Duplicate modal',
        attributes: { state: 'shown', buttonUsed: null },
      });
    }

    return hasDuplicate;
  };

  /**
   * Close duplicate modal
   */
  const handleDuplicateModalClose = () => {
    setShowDuplicateModal(false);
    setPendingSubmitData(null);
    dataDogLogger({
      message: 'Duplicate modal',
      attributes: { state: 'hidden', buttonUsed: 'close' },
    });
  };

  /**
   * Cancel adding/editing and return to summary/intro
   * This is the "No, cancel" option
   */
  const handleCancelDuplicate = () => {
    const metadata = fullData?.[META_DATA_KEY] || {};
    if (
      duplicateCheckResult.duplicates.includes(
        duplicateCheckResult.arrayData[pagePerItemIndex],
      )
    ) {
      metadata[itemDuplicateDismissedName] = false;
    }

    // Remove the item if it was being added
    const arrayData = get(arrayPath, fullData);
    let newArrayData = arrayData;
    if (isAdd) {
      const arrayIndex = parseInt(pagePerItemIndex, 10);
      newArrayData = arrayData.filter((_, i) => i !== arrayIndex);
    }

    setFormData({
      ...fullData,
      [arrayPath]: newArrayData,
      [META_DATA_KEY]: metadata || null,
    });

    setShowDuplicateModal(false);
    setPendingSubmitData(null);
    dataDogLogger({
      message: 'Duplicate modal',
      attributes: { state: 'hidden', buttonUsed: 'cancel' },
    });

    // Determine where to navigate
    let path;
    const isReview = new URLSearchParams(window?.location?.search)?.has(
      'review',
    );

    if (isReview) {
      path = reviewRoute;
    } else if (isEdit) {
      path = summaryRoute;
    } else {
      path =
        required(fullData) && introRoute && !newArrayData?.length
          ? introRoute
          : summaryRoute;
    }

    goToPath(path);
  };

  /**
   * Accept duplicate and continue
   * This is the "Yes, save and continue" option
   */
  const handleAcceptDuplicate = () => {
    const newFullData = set(
      META_DATA_KEY,
      {
        ...fullData?.[META_DATA_KEY],
        [itemDuplicateDismissedName]: true,
      },
      fullData,
    );
    setFormData(newFullData);

    const dataToSubmit = pendingSubmitData;
    setShowDuplicateModal(false);
    setPendingSubmitData(null);

    dataDogLogger({
      message: 'Duplicate modal',
      attributes: { state: 'hidden', buttonUsed: 'accept' },
    });

    // Call the onAccept callback if provided
    if (onAccept && dataToSubmit) {
      onAccept(dataToSubmit);
    }
  };

  /**
   * Get text for duplicate modal
   */
  const getDuplicateText = name => {
    if (duplicateChecks[name]) {
      return duplicateChecks[name]({
        itemData: pendingSubmitData || fullData,
        fullData,
        isEditing: isEdit,
        isAdding: isAdd,
      });
    }

    if (getText) {
      return getText(name, pendingSubmitData, fullData, pagePerItemIndex);
    }

    return '';
  };

  /**
   * Render the duplicate modal component
   * Returns null if modal should not be shown
   */
  const renderDuplicateModal = () => {
    if (!isDuplicateCheckEnabled || !shouldShowDuplicateWarning) {
      return null;
    }

    if (showDuplicateModal === false) {
      return null;
    }

    return (
      <VaModal
        status="warning"
        modalTitle={getDuplicateText('duplicateModalTitle')}
        onCloseEvent={handleDuplicateModalClose}
        onPrimaryButtonClick={handleCancelDuplicate}
        onSecondaryButtonClick={handleAcceptDuplicate}
        primaryButtonText={getDuplicateText('duplicateModalPrimaryButtonText')}
        secondaryButtonText={getDuplicateText(
          'duplicateModalSecondaryButtonText',
        )}
        visible={showDuplicateModal !== false}
      >
        {getDuplicateText('duplicateModalDescription')}
      </VaModal>
    );
  };

  return {
    // State
    isDuplicateCheckEnabled,
    shouldShowDuplicateWarning,

    // Core duplicate checking
    checkForDuplicate,

    // Modal handlers
    handleDuplicateModalClose,
    handleCancelDuplicate,
    handleAcceptDuplicate,
    getDuplicateText,

    // Render function
    renderDuplicateModal,
  };
}
