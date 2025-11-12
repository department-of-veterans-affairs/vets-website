/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-prop-types */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import {
  VaButton,
  VaModal,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import FormNavButtons from '~/platform/forms-system/src/js/components/FormNavButtons';
import navigationState from 'platform/forms-system/src/js/utilities/navigation/navigationState';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { dataDogLogger } from 'platform/monitoring/Datadog/utilities';

import { useEditOrAddForm } from './useEditOrAddForm';
import ArrayBuilderCancelButton, {
  formatPath,
} from './ArrayBuilderCancelButton';
import {
  getArrayUrlSearchParams,
  META_DATA_KEY,
  getItemDuplicateDismissedName,
  defaultDuplicateResult,
  checkForDuplicatesInItemPages,
} from './helpers';

/**
 * @param {{
 *   arrayPath: string,
 *   nounPlural: string,
 *   nounSingular: string,
 *   getSummaryPath: (formData) => string,
 *   getIntroPath: (formData) => string,
 *   required: (formData) => boolean,
 *   reviewRoute: string,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText,
 *   duplicateChecks?: object,
 *   currentPath: string,
 * }} props
 */
export default function ArrayBuilderItemPage({
  arrayPath,
  getSummaryPath,
  getIntroPath,
  reviewRoute,
  getText,
  required,
  duplicateChecks: duplicateChecksGlobal = {},
  currentPath,
}) {
  /** @type {CustomPageType} */
  function CustomPage(props) {
    const [duplicateCheckResult, setDuplicateCheckResult] = useState(
      defaultDuplicateResult,
    );
    const searchParams = getArrayUrlSearchParams();
    const isEdit = !!searchParams.get('edit');
    const isAdd = !!searchParams.get('add');
    const isReview = searchParams?.has('review');
    const currentItem = get(arrayPath, props.fullData)?.[
      props.pagePerItemIndex
    ];
    const introRoute = getIntroPath(props.fullData);
    const summaryRoute = getSummaryPath(props.fullData);

    // duplicateChecks will only apply to specific internal item pages
    const internalPageDuplicateChecks =
      duplicateChecksGlobal?.itemPathModalChecks?.[
        currentPath.split(':index/')[1]
      ];
    const duplicateChecks = internalPageDuplicateChecks
      ? {
          ...duplicateChecksGlobal,
          // overwrite global with per-page settings
          ...internalPageDuplicateChecks,
        }
      : {};
    const itemDuplicateDismissedName = getItemDuplicateDismissedName({
      arrayPath,
      // use global duplicateChecks because using per-page checks will cause the
      // modal to show on all internal array pages even after accepting the
      // duplicate
      duplicateChecks: duplicateChecksGlobal,
      fullData: props.fullData,
      itemIndex: props.pagePerItemIndex,
    });

    // null = modal not seen, false = don't show modal,
    // object of newProps (truthy) needed for updated modal content = show modal
    const [showDuplicateModal, setShowDuplicateModal] = useState(null);

    const { data, schema, uiSchema, onChange, onSubmit } = useEditOrAddForm({
      isEdit,
      schema: props.schema,
      uiSchema: props.uiSchema,
      data: props.data,
      fullData: props.fullData || {},
      onChange: props.onChange,
      onSubmit: props.onSubmit,
      index: props.pagePerItemIndex
        ? parseInt(props.pagePerItemIndex, 10)
        : null,
      arrayPath,
    });

    if (!props.onReviewPage && !isEdit && !isAdd) {
      // we should only arrive at this page with
      // ?add=true or ?edit=true, so if we somehow
      // get here without those, redirect to the
      // summary/intro
      const path =
        required(props.data) && introRoute && !data?.length
          ? introRoute
          : summaryRoute;

      // We might end up here from a save in progress continue,
      // but ?add=true or ?edit=true won't be set...
      // Consider how to handle this in the future, so save in progress can work.
      // In the meantime, go back to intro or summary, and set navigation event
      // so that validation for missing info will work properly.
      navigationState.setNavigationEvent();
      props.goToPath(path);
      return null;
    }

    if (props.onReviewPage || (isEdit && !schema)) {
      // 1. Don't show for review page.
      // 2. If we're editing, the schema will initially be null
      //    so just return null until schema is loaded by useState
      return null;
    }

    const NavButtons = props.NavButtons || FormNavButtons;
    const handlers = {
      onSubmit: newProps => {
        setShowDuplicateModal(null);

        const check = checkForDuplicatesInItemPages({
          arrayPath,
          duplicateChecks,
          fullData: props.fullData,
          index: props.pagePerItemIndex,
          // newProps.formData is limited to the current array item
          itemData: newProps.formData,
        });
        setDuplicateCheckResult(check);

        if (
          !props.fullData?.[META_DATA_KEY]?.[itemDuplicateDismissedName] &&
          check.duplicates.includes(check.arrayData[props.pagePerItemIndex])
        ) {
          setShowDuplicateModal(newProps);
          dataDogLogger({
            message: 'Duplicate modal',
            attributes: { state: 'shown', buttonUsed: null },
          });
          return;
        }
        onSubmit(newProps);
      },
      onDuplicateModalClose: () => {
        setShowDuplicateModal(false);
        dataDogLogger({
          message: 'Duplicate modal',
          attributes: { state: 'hidden', buttonUsed: 'close' },
        });
      },
      onDuplicateModalPrimaryClick: () => {
        // Primary button is "No, cancel adding/editing"
        const metadata = props.fullData?.[META_DATA_KEY] || {};
        if (
          duplicateCheckResult.duplicates.includes(
            defaultDuplicateResult.arrayData[props.pagePerItemIndex],
          )
        ) {
          metadata[itemDuplicateDismissedName] = false;
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
      },
      onDuplicateModalSecondaryClick: () => {
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
        onSubmit(showDuplicateModal); // Navigate to next page
        dataDogLogger({
          message: 'Duplicate modal',
          attributes: { state: 'hidden', buttonUsed: 'accept' },
        });
        setShowDuplicateModal(false);
      },
    };

    // If showDuplicateWarning is true, we only need showDuplicateModal to not
    // be false to show the modal
    const showDuplicateWarning = duplicateCheckResult?.duplicates.includes(
      duplicateCheckResult.arrayData[props.pagePerItemIndex],
    );
    const isExternalComparison = duplicateChecks?.comparisonType === 'external';
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

    return (
      <>
        {showDuplicateModal !== false &&
          showDuplicateWarning &&
          !props.fullData?.[META_DATA_KEY]?.[itemDuplicateDismissedName] && (
            <VaModal
              status="warning"
              modalTitle={getDuplicateText('duplicateModalTitle')}
              onCloseEvent={handlers.onDuplicateModalClose}
              onPrimaryButtonClick={handlers.onDuplicateModalPrimaryClick}
              onSecondaryButtonClick={handlers.onDuplicateModalSecondaryClick}
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
          )}
        <SchemaForm
          name={props.name}
          title={props.title}
          data={data}
          appStateData={props.appStateData}
          schema={schema}
          uiSchema={uiSchema}
          pagePerItemIndex={props.pagePerItemIndex}
          formContext={props.formContext}
          getFormData={props.getFormData}
          trackingPrefix={props.trackingPrefix}
          onChange={onChange}
          onSubmit={handlers.onSubmit}
        >
          <>
            {isAdd && (
              <>
                <ArrayBuilderCancelButton
                  goToPath={props.goToPath}
                  arrayPath={arrayPath}
                  summaryRoute={summaryRoute}
                  introRoute={introRoute}
                  reviewRoute={reviewRoute}
                  getText={getText}
                  required={required}
                />
                {/* save-in-progress link, etc */}
                {props.pageContentBeforeButtons}
                {props.contentBeforeButtons}
                <NavButtons
                  goBack={props.goBack}
                  goForward={props.onContinue}
                  submitToContinue
                  useWebComponents={
                    props.formOptions?.useWebComponentForNavigation
                  }
                />
              </>
            )}
            {isEdit && (
              <div className="vads-u-display--flex">
                <div className="vads-u-margin-right--2">
                  <ArrayBuilderCancelButton
                    goToPath={props.goToPath}
                    arrayPath={arrayPath}
                    summaryRoute={summaryRoute}
                    introRoute={introRoute}
                    reviewRoute={reviewRoute}
                    getText={getText}
                    required={required}
                    className="vads-u-margin-0"
                  />
                </div>
                <div>
                  <VaButton
                    continue
                    submit="prevent"
                    // "Continue" will display instead of `text`
                    // prop until this is fixed:
                    // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/2733
                    text={getText('editSaveButtonText')}
                  />
                </div>
              </div>
            )}

            {props.contentAfterButtons}
          </>
        </SchemaForm>
      </>
    );
  }

  CustomPage.propTypes = {
    name: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    appStateData: PropTypes.object,
    contentAfterButtons: PropTypes.node,
    contentBeforeButtons: PropTypes.node,
    data: PropTypes.object,
    formContext: PropTypes.object,
    formOptions: PropTypes.object,
    fullData: PropTypes.object,
    getFormData: PropTypes.func,
    goBack: PropTypes.func,
    goToPath: PropTypes.func,
    onChange: PropTypes.func,
    onContinue: PropTypes.func,
    onReviewPage: PropTypes.bool,
    onSubmit: PropTypes.func,
    pageContentBeforeButtons: PropTypes.node,
    pagePerItemIndex: PropTypes.string,
    path: PropTypes.string,
    required: PropTypes.bool,
    setFormData: PropTypes.func,
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
    NavButtons: PropTypes.func,
    duplicateChecks: PropTypes.shape({
      // allowDuplicates: PropTypes.bool, // Not enabled in MVP
      comparisons: PropTypes.arrayOf(PropTypes.string),
      duplicateModalTitle: PropTypes.func,
      duplicateModalPrimaryButtonText: PropTypes.func,
      duplicateModalSecondaryButtonText: PropTypes.func,
      duplicateModalDescription: PropTypes.func,
      externalComparisonData: PropTypes.func,
      itemPathModalChecks: PropTypes.object,
    }),
  };

  return CustomPage;
}

ArrayBuilderItemPage.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  modalDescription: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  nounPlural: PropTypes.string.isRequired,
  nounSingular: PropTypes.string.isRequired,
  summaryRoute: PropTypes.string.isRequired,
  required: PropTypes.func.isRequired,
  introRoute: PropTypes.string,
  reviewRoute: PropTypes.string.isRequired,
  getText: PropTypes.func.isRequired,
};
