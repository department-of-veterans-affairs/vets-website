import React, { useState, useMemo, useEffect, useRef } from 'react';
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

/**
 * Handles duplicate checks in array builder forms.
 * Provides submit handler wrapper and duplicate modal rendering.
 *
 * @param {Object} options
 * @param {ArrayBuilderItemPageProps} options.arrayBuilderProps from `props.arrayBuilder` for CustomPages, or directly passed in for ArrayBuilderItemPage
 * @param {CustomPageProps} options.customPageProps
 *
 * @returns {{
 *   checkForDuplicates: (onSubmit: (props: Object) => void) => ((props: Object) => void),
 *   renderDuplicateModal: () => (React.ReactElement|null)
 * }}
 *
 * @example
 * ```js
 * const { checkForDuplicates, renderDuplicateModal } = useDuplicateChecks({
 *   arrayBuilderProps,
 *   customPageProps: props,
 * });
 *
 * const handleSubmit = checkForDuplicates(
 *   useCallback(
 *     newProps => {
 *       onSubmit(newProps);
 *     },
 *     [onSubmit],
 *   ),
 * );
 * <SchemaForm
 *   ...
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export function useDuplicateChecks({
  arrayBuilderProps,
  customPageProps: props,
}) {
  // Derive edit/add mode from URL params
  const searchParams = getArrayUrlSearchParams();
  const isEdit = !!searchParams.get('edit');
  const isAdd = !!searchParams.get('add');
  const isReview = searchParams?.has('review');
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
  const duplicateChecks = useMemo(
    () =>
      internalPageDuplicateChecks
        ? {
            ...duplicateChecksGlobal,
            // overwrite global with per-page settings
            ...internalPageDuplicateChecks,
          }
        : duplicateChecksGlobal || {},
    [duplicateChecksGlobal, internalPageDuplicateChecks],
  );

  const [duplicateCheckResult, setDuplicateCheckResult] = useState(
    defaultDuplicateResult,
  );
  const [showDuplicateModal, setShowDuplicateModal] = useState(null);
  // When a duplicate is found, we show a modal instead of submitting immediately.
  // Store the submit function here to call it later if the user clicks "Yes, continue anyway"
  const [pendingOnSubmit, setPendingOnSubmit] = useState(null);

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const hasDuplicateChecks = Object.keys(duplicateChecks).length > 0;

  const itemDuplicateDismissedName = useMemo(
    () =>
      getItemDuplicateDismissedName({
        arrayPath,
        // use global duplicateChecks because using per-page checks will cause the
        // modal to show on all internal array pages even after accepting the
        // duplicate
        duplicateChecks: duplicateChecksGlobal,
        fullData: props.fullData,
        itemIndex: props.pagePerItemIndex,
      }),
    [arrayPath, duplicateChecksGlobal, props.fullData, props.pagePerItemIndex],
  );

  /**
   * @param {(props: Object) => void} onSubmit - The original submit handler
   * @returns {(props: Object) => void} - Wrapped submit handler with duplicate checking
   *
   * Usage:
   * const handleSubmit = checkForDuplicates(
   *   useCallback(
   *     newProps => {
   *       onSubmit(newProps);
   *     },
   *     [onSubmit],
   *   ),
   * );
   * <SchemaForm
   *   ...
   *   onSubmit={handleSubmit}
   * />
   */
  const checkForDuplicates = onSubmit => {
    // If no duplicate checks configured, just pass through
    if (!hasDuplicateChecks) {
      return onSubmit;
    }

    return onSubmitProps => {
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

      const hasDuplicate =
        !props.fullData?.[META_DATA_KEY]?.[itemDuplicateDismissedName] &&
        check.duplicates.includes(check.arrayData[props.pagePerItemIndex]);

      if (hasDuplicate) {
        setShowDuplicateModal(onSubmitProps);
        // Callback is needed otherwise useState interprets the function as an updater
        setPendingOnSubmit(() => onSubmit);
        dataDogLogger({
          message: 'Duplicate modal',
          attributes: { state: 'shown', buttonUsed: null },
        });
      } else {
        // No duplicate, proceed with submission
        onSubmit(onSubmitProps);
      }
    };
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
      delete metadata[itemDuplicateDismissedName];
    }

    // Code modified from ArrayBuilderCancelButton
    const arrayData = get(arrayPath, props.fullData);
    let newArrayData = arrayData;
    let path;
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
    pendingOnSubmit?.(showDuplicateModal);
    dataDogLogger({
      message: 'Duplicate modal',
      attributes: { state: 'hidden', buttonUsed: 'accept' },
    });
    if (isMountedRef.current) {
      setShowDuplicateModal(false);
      setPendingOnSubmit(null);
    }
  };

  // If showDuplicateWarning is true, we only need showDuplicateModal to not
  // be false to show the modal
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
   * Render duplicate modal if applicable
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
