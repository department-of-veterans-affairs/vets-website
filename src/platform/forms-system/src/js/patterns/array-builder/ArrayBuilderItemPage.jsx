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

import { useEditOrAddForm } from './useEditOrAddForm';
import ArrayBuilderCancelButton, {
  formatPath,
} from './ArrayBuilderCancelButton';
import {
  getArrayUrlSearchParams,
  META_DATA_KEY,
  getItemDuplicateDismissedName,
} from './helpers';

/**
 * @param {{
 *   arrayPath: string,
 *   nounPlural: string,
 *   nounSingular: string,
 *   summaryRoute: string,
 *   introRoute?: string,
 *   required: (formData) => boolean,
 *   reviewRoute: string,
 *   getText: import('./arrayBuilderText').ArrayBuilderGetText,
 * }} props
 */
export default function ArrayBuilderItemPage({
  arrayPath,
  summaryRoute,
  introRoute,
  reviewRoute,
  getText,
  required,
  duplicateChecks,
}) {
  /** @type {CustomPageType} */
  function CustomPage(props) {
    const searchParams = getArrayUrlSearchParams();
    const isEdit = !!searchParams.get('edit');
    const isAdd = !!searchParams.get('add');
    const isReview = searchParams?.has('review');
    const currentItem = get(arrayPath, props.fullData)?.[
      props.pagePerItemIndex
    ];
    const [showDuplicateModal, setShowDuplicateModal] = useState(null);
    const itemDuplicateDismissedName = getItemDuplicateDismissedName({
      arrayPath,
      duplicateChecks,
      fullData: props.fullData,
      itemIndex: props.pagePerItemIndex,
    });

    const {
      data,
      schema,
      uiSchema,
      onChange,
      onSubmit,
      duplicateCheckResult,
    } = useEditOrAddForm({
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
      duplicateChecks,
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
      onSubmit: () => {
        setShowDuplicateModal(null);
        onSubmit();
      },
      onDuplicateModalClose: () => {
        setShowDuplicateModal(false);
      },
      onDuplicateModalPrimaryClick: () => {
        // Code modified from ArrayBuilderCancelButton
        const arrayData = get(arrayPath, props.fullData);
        let newArrayData = arrayData;
        let path;
        if (isAdd) {
          const arrayIndex = parseInt(props.pagePerItemIndex, 10);
          newArrayData = arrayData.filter((_, i) => i !== arrayIndex);
          const newData = set(arrayPath, newArrayData, props.fullData);
          props.setFormData(newData);
        }

        props.setFormData({
          ...props.fullData,
          [META_DATA_KEY]: {
            ...(props.fullData?.[META_DATA_KEY] || {}),
            [itemDuplicateDismissedName]: false,
          },
        });
        setShowDuplicateModal(false);

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

        // Cancel the action
      },
      onDuplicateModalSecondaryClick: () => {
        props.setFormData({
          ...props.fullData,
          [META_DATA_KEY]: {
            ...(props.fullData?.[META_DATA_KEY] || {}),
            [itemDuplicateDismissedName]: true,
          },
        });
        setShowDuplicateModal(false);
      },
    };

    const showDuplicateWarning = duplicateCheckResult?.duplicates.includes(
      duplicateCheckResult.arrayData[props.pagePerItemIndex],
    );

    return (
      <>
        {showDuplicateModal !== false &&
          showDuplicateWarning &&
          !props.fullData?.[META_DATA_KEY]?.[itemDuplicateDismissedName] && (
            <VaModal
              status="warning"
              modalTitle={getText(
                'duplicateModalTitle',
                props.data,
                props.fullData,
                props.pagePerItemIndex,
              )}
              onCloseEvent={handlers.onDuplicateModalClose}
              onPrimaryButtonClick={handlers.onDuplicateModalPrimaryClick}
              onSecondaryButtonClick={handlers.onDuplicateModalSecondaryClick}
              primaryButtonText={getText(
                'duplicateModalPrimaryButtonText',
                props.data,
                props.fullData,
                props.pagePerItemIndex,
              )}
              secondaryButtonText={getText(
                'duplicateModalSecondaryButtonText',
                props.data,
                props.fullData,
                props.pagePerItemIndex,
              )}
              visible={showDuplicateModal !== false}
            >
              {getText(
                'duplicateModalDescription',
                props.data,
                props.fullData,
                props.pagePerItemIndex,
              )}
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
    required: PropTypes.bool,
    setFormData: PropTypes.func,
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
    NavButtons: PropTypes.func,
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
