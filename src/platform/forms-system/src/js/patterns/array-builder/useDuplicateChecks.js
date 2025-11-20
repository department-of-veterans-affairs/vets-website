import React, { useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';
import { formatPath } from './ArrayBuilderCancelButton';
import {
  checkForDuplicatesInItemPages,
  getItemDuplicateDismissedName,
  getArrayUrlSearchParams,
  META_DATA_KEY,
  defaultDuplicateResult,
} from './helpers';

const noDuplicatesHook = {
  checkForDuplicates: () => false,
  renderDuplicateModal: null,
};

/**
 * Custom hook for handling duplicate checks in array builder forms.
 * Provides duplicate checking logic and UI that can be optionally integrated
 * into your form submission workflow.
 *
 * @param {Object} config
 * @param {Object} config.arrayBuilderProps - Array builder configuration props
 * @param {Object} config.customPageProps - Component props from CustomPage
 * @param {(itemData: Object) => void} config.onAccept - Callback when user accepts duplicate (receives item data)
 *
 * @returns {{
 *   checkForDuplicates: (onSubmitProps: Object) => boolean,
 *   renderDuplicateModal: () => (React.ReactElement|null)
 * }} Duplicate check utilities
 *
 * @example
 * ```js
 * const { checkForDuplicates, renderDuplicateModal } = useDuplicateChecks({
 *   arrayBuilderProps,
 *   customPageProps: props,
 *   onAccept: itemData => {
 *     onSubmit({ formData: itemData });
 *   },
 * });
 *
 * const handleSubmit = newProps => {
 *   const hasDuplicate = checkForDuplicates(newProps);
 *   if (!hasDuplicate) {
 *     onSubmit(newProps);
 *   }
 * };
 * ```
 */
export function useDuplicateChecks({
  arrayBuilderProps,
  customPageProps: props,
  onAccept,
}) {
  // Derive edit/add mode from URL params
  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');
  const {
    arrayPath,
    getSummaryPath,
    getIntroPath,
    reviewRoute,
    getText,
    required,
    duplicateChecks: duplicateChecksGlobal = {},
    currentPath,
  } = arrayBuilderProps;

  const introRoute = getIntroPath(props.fullData);
  const summaryRoute = getSummaryPath(props.fullData);

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
  // const [pendingSubmitData, setPendingSubmitData] = useState(null);

  if (Object.keys(duplicateChecks).length === 0) {
    // No duplicate checks configured
    return noDuplicatesHook;
  }

  const itemDuplicateDismissedName = getItemDuplicateDismissedName({
    arrayPath,
    // use global duplicateChecks because using per-page checks will cause the
    // modal to show on all internal array pages even after accepting the
    // duplicate
    duplicateChecks: duplicateChecksGlobal,
    fullData: props.fullData,
    itemIndex: props.pagePerItemIndex,
  });

  /**
   * Check to run form submit
   * @param {Object} onSubmitProps - props from onSubmit
   * @returns {boolean} - True if duplicate found and not dismissed
   */
  const checkForDuplicates = onSubmitProps => {
    let hasDuplicate = false;
    setShowDuplicateModal(null);

    const check = checkForDuplicatesInItemPages({
      arrayPath,
      duplicateChecks,
      fullData: props.fullData,
      index: props.pagePerItemIndex,
      // newProps.formData is limited to the current array item
      itemData: onSubmitProps.formData,
    });
    setDuplicateCheckResult(check);

    if (
      !props.fullData?.[META_DATA_KEY]?.[itemDuplicateDismissedName] &&
      check.duplicates.includes(check.arrayData[props.pagePerItemIndex])
    ) {
      setShowDuplicateModal(onSubmitProps);
      dataDogLogger({
        message: 'Duplicate modal',
        attributes: { state: 'shown', buttonUsed: null },
      });
      hasDuplicate = true;
    }

    return hasDuplicate;
  };

  const onDuplicateModalClose = () => {
    setShowDuplicateModal(false);
    dataDogLogger({
      message: 'Duplicate modal',
      attributes: { state: 'hidden', buttonUsed: 'close' },
    });
  };

  const onDuplicateModalPrimaryClick = () => {
    // Primary button is "No, cancel adding/editing"
    const metadata = props.fullData?.[META_DATA_KEY] || {};
    if (
      duplicateCheckResult.duplicates.includes(
        duplicateCheckResult.arrayData[props.pagePerItemIndex],
      )
    ) {
      metadata[itemDuplicateDismissedName] = false;
    }

    // Code modified from ArrayBuilderCancelButton
    const arrayData = get(arrayPath, props.fullData);
    let newArrayData = arrayData;
    if (isAdd) {
      const arrayIndex = parseInt(props.pagePerItemIndex, 10);
      newArrayData = arrayData.filter((_, i) => i !== arrayIndex);
    }
    props.setFormData({
      ...props.fullData,
      [arrayPath]: newArrayData,
      [META_DATA_KEY]: metadata || null,
    });

    setShowDuplicateModal(false);
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
      // Required flow goes:
      // intro -> items -> summary -> items -> summary
      // so if we have no items, go back to intro
      // otherwise go to summary
      //
      // Optional flow goes:
      // summary -> items -> summary, so go back to summary
      path =
        required(props.fullData) && introRoute && !newArrayData?.length
          ? introRoute
          : summaryRoute;
    }
    props.goToPath(formatPath(path));
  };

  const onDuplicateModalSecondaryClick = () => {
    // Secondary button is "Yes, save and continue";
    const newFullData = set(
      META_DATA_KEY,
      {
        [itemDuplicateDismissedName]: true,
      },
      props.fullData,
    );
    props.setFormData(newFullData);
    // showDuplicateModal contains newest item page formData
    // Call the onAccept callback if provided
    if (onAccept && showDuplicateModal) {
      onAccept(showDuplicateModal.formData);
    }
    dataDogLogger({
      message: 'Duplicate modal',
      attributes: { state: 'hidden', buttonUsed: 'accept' },
    });
    setShowDuplicateModal(false);
  };

  const showDuplicateWarning = duplicateCheckResult?.duplicates.includes(
    duplicateCheckResult.arrayData[props.pagePerItemIndex],
  );

  const getDuplicateText = name =>
    duplicateChecks[name]?.({
      // Saving submitted formData to 'showDuplicateModal' otherwise the modal
      // content may not match the page changes
      itemData: showDuplicateModal?.formData || props.data,
      fullData: props.fullData,
      isEditing: isEdit,
      isAdding: isAdd,
    }) ||
    getText(
      name,
      showDuplicateModal?.formData || showDuplicateModal,
      props.fullData,
      props.pagePerItemIndex,
    );

  /**
   * Render the duplicate modal component
   * Returns null if modal should not be shown
   */
  const renderDuplicateModal = () => {
    if (
      showDuplicateModal !== false &&
      showDuplicateWarning &&
      !props.fullData?.[META_DATA_KEY]?.[itemDuplicateDismissedName]
    ) {
      return (
        <VaModal
          status="warning"
          modalTitle={getDuplicateText('duplicateModalTitle')}
          onCloseEvent={onDuplicateModalClose}
          onPrimaryButtonClick={onDuplicateModalPrimaryClick}
          onSecondaryButtonClick={onDuplicateModalSecondaryClick}
          primaryButtonText={getDuplicateText(
            'duplicateModalPrimaryButtonText',
          )}
          secondaryButtonText={getDuplicateText(
            'duplicateModalSecondaryButtonText',
          )}
          visible={showDuplicateModal !== false}
        >
          {getDuplicateText('duplicateModalDescription')}
        </VaModal>
      );
    }

    return null;
  };

  return {
    checkForDuplicates,
    renderDuplicateModal,
  };
}
