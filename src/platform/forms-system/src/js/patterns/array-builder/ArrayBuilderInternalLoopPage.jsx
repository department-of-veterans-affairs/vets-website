/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import SchemaForm from '@department-of-veterans-affairs/platform-forms-system/SchemaForm';
import {
  VaButton,
  VaModal,
  VaButtonIcon,
  VaRadio,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { isReactComponent } from '@department-of-veterans-affairs/platform-utilities/ui';

import FormNavButtons from 'platform/forms-system/src/js/components/FormNavButtons';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';
import { Element, scrollTo, scrollToTop } from 'platform/utilities/scroll';
import { focusElement, scrollToFirstError } from 'platform/utilities/ui';
import {
  $,
  getFocusableElements,
} from 'platform/forms-system/src/js/utilities/ui';

// Duplicate checks not included in this MVP
// import { useDuplicateChecks } from './useDuplicateChecks';
import { useItemPageGuard } from './useItemPageGuard';
import ArrayBuilderCancelButton from './ArrayBuilderCancelButton';
import {
  scrollAndFocusAlert,
  focusOnHeader,
  defaultSummaryPageScrollAndFocusTarget,
  getArrayUrlSearchParams,
  initGetText,
  assignGetItemName,
  useHeadingLevels,
  maxItemsFn,
} from './helpers';

/**
 * @param {ArrayBuilderInternalLoopPageProps} itemPageProps
 */
export default function ArrayBuilderInternalLoopPage(itemPageProps) {
  /** @type {CustomPageType} */
  function CustomPage(props) {
    const [pageSubmitted, setPageSubmitted] = useState(false);
    const [editingIndex, setEditingIndex] = useState(props.data?.length === 0);
    const [editingInitialData, setEditingInitialData] = useState(null);
    const [removingIndex, setRemovingIndex] = useState(false);
    const [isAddingNewItem, setIsAddingNewItem] = useState(false);
    const [addAnotherValue, setAddAnotherValue] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showSuccessAlertText, setShowSuccessAlertText] = useState(false);

    const editWrapperRef = useRef(null);

    const arrayBuilderProps = itemPageProps;
    const {
      arrayPath,
      getSummaryPath,
      getIntroPath,
      reviewRoute,
      getText,
      currentPath,
      nestedArrayOptions = {},
      userText = {},
    } = arrayBuilderProps;

    const { arrayPathKeys, required } = nestedArrayOptions;

    const dataKey = arrayPathKeys?.slice(-1)?.[0] || arrayPath;
    const radioKey = `view:${dataKey}_add_another`;
    const data = props.data?.[dataKey] || [];

    useEffect(
      () => {
        // Show add flow when the array is empty
        if (data.length === 0) {
          setEditingIndex(0);
          setIsAddingNewItem(true);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [data.length],
    );

    useEffect(
      () => {
        // Initial page focus
        focusOnHeader();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [editingIndex],
    );

    useEffect(
      () => {
        // Focus on success alert - item removed or updated
        if (showSuccessAlertText) {
          scrollAndFocusAlert();
        }
      },
      [showSuccessAlertText],
    );

    const { fullData, pagePerItemIndex } = props;
    const searchParams = getArrayUrlSearchParams();
    const isEdit = !!searchParams.get('edit');
    const isAdd = !!searchParams.get('add');
    const isReview = searchParams?.has('review');
    const introRoute = getIntroPath(props.fullData);
    const summaryRoute = getSummaryPath(props.fullData);
    const uiSchema = (props.uiSchema || {})[dataKey] || {};
    const schema = (props.schema || {}).properties?.[dataKey] || {};

    const isRequired = required?.(data);
    const uiOptions = uiSchema?.['ui:options'] || {};

    const nestedNounSingular = nestedArrayOptions?.nounSingular || 'item';
    const cancelTitleEnding = nestedArrayOptions.itemName
      ? nestedArrayOptions.itemName
      : `this ${nestedNounSingular}`;

    const getInternalText = initGetText({
      getItemName: assignGetItemName(nestedArrayOptions.text),
      nounPlural: nestedArrayOptions?.nounPlural,
      nounSingular: nestedNounSingular,
      textOverrides: {
        // Override the cancel add & cancel edit modal titles because they
        // pull the item name from the outer array which becomes confusing
        cancelAddTitle: () => `Cancel adding ${cancelTitleEnding}`,
        cancelEditTitle: () => `Cancel editing ${cancelTitleEnding}`,
        // Override the missing information error alert content
        cardItemMissingInformation: () =>
          `This ${nestedNounSingular} is missing information. Edit and complete this ${nestedNounSingular}’s information before continuing.`,
        ...userText,
        ...nestedArrayOptions.text,
      },
    });

    const { headingLevel } = useHeadingLevels(
      arrayBuilderProps.reviewPanelHeadingLevel,
      true,
    );
    const Heading = `h${headingLevel}`;
    const title = uiSchema?.['ui:title'] || schema?.title;
    const description = uiSchema?.['ui:description'];
    const textDescription =
      typeof description === 'string' ? description : null;
    const TitleField = title && isReactComponent(title) ? title : null;
    const DescriptionField = isReactComponent(description) ? description : null;
    const hasTitleOrDescription = !!title || !!textDescription;

    const modalPrimaryButtonText =
      getInternalText('modalPrimaryButtonText') ||
      `Yes, remove this ${nestedArrayOptions.itemName || 'item'}`;
    const modalSecondaryButtonText =
      getInternalText('modalSecondaryButtonText') || 'No, cancel';
    const useLinkInsteadOfYesNo =
      nestedArrayOptions.useLinkInsteadOfYesNo ?? false;
    const maxItemValue = maxItemsFn(
      nestedArrayOptions.maxItems || schema.maxItems,
      props.data,
    );
    const hasMaxItems = data.length >= (maxItemValue || Infinity);

    const isIncomplete = indx =>
      nestedArrayOptions.isItemIncomplete?.(data?.[indx]) || null;

    // Duplicate checks not included in this MVP
    // const { checkForDuplicates, renderDuplicateModal } = useDuplicateChecks({
    //   arrayBuilderProps: { ...arrayBuilderProps, ...nestedArrayOptions },
    //   customPageProps: props,
    // });

    /**
     * Nested form page onChange handler.
     * @param {array} changedData - array of all data from nested form page
     */
    const handleChange = changedData => {
      props.onChange(set([dataKey, editingIndex], changedData, props.data));
    };

    /**
     * Clicking edit on an item that’s not last and so is in view mode
     * @param {Event} event - click event from edit button
     * @param {number} index - The index of the item to edit
     */
    const handleEdit = (event, index) => {
      event.preventDefault();
      setEditingIndex(index);
      setEditingInitialData(data[index]);
      scrollToTop();
      setTimeout(() => {
        const focusableElement = getFocusableElements(
          editWrapperRef?.current,
        )?.[0];
        if (focusableElement) {
          focusElement(focusableElement);
        }
      }, 100);
    };

    /*
     * Clicking Add another sets the editing index so that it adds a new object
     * Setting isAddingNewItem is a flag to
     */
    const handleAdd = () => {
      setEditingIndex(data.length);
      setIsAddingNewItem(true);
    };

    /**
     * Clicking Remove on an item in edit mode
     * @param {number} indexToRemove - The index of the item to remove
     * @param {boolean} confirmRemove - If true, will open a modal to confirm remove
     */
    const handleRemove = (indexToRemove, confirmRemove = true) => {
      if (confirmRemove) {
        setRemovingIndex(indexToRemove);
      } else {
        // Filter the local data array to remove the item
        const newItems = data.filter((val, index) => index !== indexToRemove);
        props.onChange({
          ...(get([arrayPath, pagePerItemIndex], props.fullData) || {}),
          [dataKey]: newItems,
        });

        setShowSuccessAlertText(
          getInternalText('alertItemDeleted', data, props.data, indexToRemove),
        );
        setRemovingIndex(false);
      }
    };

    /**
     * Hide success alert that displays after successfully updating or removing
     * an item
     */
    const hideMessageAlert = () => {
      setShowSuccessAlertText(false);
    };

    /**
     * Set the value of the add another radio when it changes
     * @param {Event} props - VA Radio onVaValueChange event
     */
    const handleAddAnotherRadioChange = ({ detail: { value } }) => {
      setAddAnotherValue(value);
    };

    /**
     * Clicking Yes in the remove item modal
     */
    const handleRemoveModal = () => {
      // reset success alert so focus useEffect is triggered
      hideMessageAlert();
      handleRemove(removingIndex, false);
    };

    /**
     * Clicking No or outside the modal in the remove item modal
     */
    const handleCloseRemoveModal = () => {
      hideMessageAlert();
      focusElement(`va-card[data-index="${removingIndex}"]`);
      setRemovingIndex(false);
    };

    /**
     * Submit page and continue past internal array list loop page
     */
    const submitPage = () => {
      props.onSubmit({
        formData: get([arrayPath, pagePerItemIndex], props.fullData) || {},
      });
    };

    /**
     * Handle nested form submission
     * @param {{
     *   errors: object,
     *   formData: object
     * }} props
     */
    const handleNestedFormSubmit = ({ errors, formData }) => {
      if (isAddingNewItem) {
        // List loop pages usually focus on the header after an addition, but
        // in this case, we're going to focus on the newly added card
        setTimeout(() => {
          const addedCard = $(`va-card[data-index="${editingIndex}"]`);
          if (addedCard) {
            scrollTo(addedCard);
            focusElement(addedCard);
          }
        }, 100);
      } else {
        setShowSuccessAlertText(
          getInternalText('alertItemUpdated', data, props.data, editingIndex),
        );
      }

      setEditingIndex(false);
      setIsAddingNewItem(false);
      setPageSubmitted(false);
    };

    /**
     * Handle submission of the summary page, and internal form pages based on
     * the state flags within this component. We're not using URL search
     * parameters
     * @param {Event} event
     */
    const handleSubmit = event => {
      event.preventDefault();
      setPageSubmitted(true);
      hideMessageAlert();

      // handleSubmit is called while editing a page with errors, so prevent
      // submission and don't do these summary page submission tasks
      if (editingIndex === false || isAddingNewItem) {
        const hasIncompleteItem = data.some((_item, index) =>
          isIncomplete(index),
        );

        if (hasMaxItems) {
          if (hasIncompleteItem) {
            scrollAndFocusAlert();
          } else {
            submitPage();
          }
          return;
        }

        switch (addAnotherValue) {
          case 'Y':
            if (hasMaxItems) {
              // Do nothing because yes/no radio is hidden
            } else {
              handleAdd();
            }
            break;

          case 'N':
            if (hasIncompleteItem) {
              scrollAndFocusAlert();
            } else if (data.length === 0 && isRequired) {
              // Field is required, jump straight to editing index 0 entry
              setEditingIndex(0);
            } else {
              submitPage();
            }
            break;

          default:
            if (isAddingNewItem) {
              setPageSubmitted(false);
            } else if (isRequired) {
              setErrorMessage('Select yes or no');
              scrollAndFocusAlert();
            }
            setEditingIndex(false);
            setIsAddingNewItem(false);
        }
      } else {
        scrollToFirstError();
      }
    };

    /**
     * Cancel behavior for nested summary page & nested form page. If
     * cancelling from adding a new entry, we need to remove the new entry. If
     * cancelling from editing, we need to reset the edit flags & restore the
     * original item data.
     * @returns {boolean} - indicator to allow or block cancel from processing
     * the parent array's cancel code
     */
    const handleConfirmCancel = () => {
      if (isAddingNewItem) {
        // Remove last (added) item
        const updatedData = data.filter(
          (_val, index) => index !== editingIndex,
        );
        props.onChange(set([dataKey], updatedData, props.data));
      } else {
        // Leveerage handleChange to restore initial data
        handleChange(editingInitialData);
      }
      setEditingInitialData(null);
      // Let cancel continue if used on the nested array summary page, or
      // cancelling leaving the array empty, but not while adding or editing a
      // nested array item leaving the array with at least one item
      const letCancelContinue = editingIndex === false || data.length === 0;

      setIsAddingNewItem(false);
      setEditingIndex(false);
      return letCancelContinue;
    };

    /**
     * Continue button behavior to use handleSubmit to keep the submit/go
     * forward behavior consistent.
     * @param {Event} event - Button click event
     */
    const onContinue = event => {
      handleSubmit(event);
    };

    /**
     * Go back button behavior to use handleGoBack to clear the in progres data
     * while adding or editing a nested item entry
     * @param {Event} event - Button click event
     */
    const handleGoBack = event => {
      if (editingIndex !== false || isAddingNewItem) {
        // Clearing entered data on back otherwise upon returning to the page,
        // a summary card (possibly showing an incomplete label) is displayed;
        // current behavior in the list loop is if you navigate back to the
        // summary page, all newly added content is lost
        hideMessageAlert();
        handleRemove(editingIndex, false);
        setEditingIndex(false);
        setIsAddingNewItem(false);
      }
      props.goBack(event);
    };

    const NavButtons = props.NavButtons || FormNavButtons;

    const NavSection = () => (
      <>
        {isAdd && (
          <div className="vads-u-margin-top--2 vads-u-margin-bottom--4">
            <ArrayBuilderCancelButton
              goToPath={props.goToPath}
              arrayPath={dataKey}
              getText={getInternalText}
              required={required}
              nestedArrayCallback={handleConfirmCancel}
              summaryRoute={summaryRoute}
              introRoute={introRoute}
              reviewRoute={reviewRoute}
            />
            {/* save-in-progress link, etc */}
            {props.pageContentBeforeButtons}
            {props.contentBeforeButtons}
            <NavButtons
              goBack={handleGoBack}
              goForward={handleSubmit}
              submitToContinue
              useWebComponents={props.formOptions?.useWebComponentForNavigation}
            />
          </div>
        )}
        {isEdit && (
          <div className="vads-u-display--flex vads-u-margin-top--2 vads-u-margin-bottom--4">
            <div className="vads-u-margin-right--2">
              <ArrayBuilderCancelButton
                goToPath={props.goToPath}
                arrayPath={arrayPath}
                getText={getInternalText}
                required={required}
                className="vads-u-margin-0"
                nestedArrayCallback={handleConfirmCancel}
                summaryRoute={summaryRoute}
                introRoute={introRoute}
                reviewRoute={reviewRoute}
              />
            </div>
            <div>
              <VaButton
                continue
                submit="prevent"
                onClick={handleSubmit}
                // "Continue" will display instead of `text`
                // prop until this is fixed:
                // https://github.com/department-of-veterans-affairs/vets-design-system-documentation/issues/2733
                text={getInternalText('editSaveButtonText')}
              />
            </div>
          </div>
        )}

        {props.contentAfterButtons}
      </>
    );

    // Editing an internal item
    return editingIndex !== false || isAddingNewItem ? (
      <div ref={editWrapperRef}>
        <Element name="topScrollElement" />
        <SchemaForm
          name={props.name}
          title={props.title}
          data={data[editingIndex]}
          appStateData={props.appStateData}
          schema={schema?.additionalItems || schema?.properties || {}}
          uiSchema={uiSchema.items || {}}
          pagePerItemIndex={editingIndex}
          formContext={props.formContext}
          getFormData={props.getFormData}
          trackingPrefix={props.trackingPrefix}
          uploadFile={props.uploadFile}
          onChange={handleChange}
          onSubmit={handleNestedFormSubmit}
        >
          <div className="vads-u-margin-y--4">
            <NavSection />
          </div>
        </SchemaForm>
      </div>
    ) : (
      <div>
        {hasTitleOrDescription && (
          <div className="schemaform-block-header">
            {TitleField ? (
              <TitleField formData={props.data} />
            ) : (
              title && <Heading>{title}</Heading>
            )}
            {textDescription && <p>{textDescription}</p>}
            {!textDescription && !DescriptionField && description}
          </div>
        )}
        <div className="vads-u-display--flex vads-u-justify-content--space-between vads-u-flex-direction--column">
          {/* Show an alert when no more items can be added */}
          {hasMaxItems && (
            <VaAlert status="warning" slim>
              <p className="vads-u-margin-y--0">
                {getInternalText('alertMaxItems')}
              </p>
            </VaAlert>
          )}

          {showSuccessAlertText !== false ? (
            <div className="vads-u-margin-top--2">
              <VaAlert
                onCloseEvent={hideMessageAlert}
                slim
                closeable
                status="success"
                closeBtnAriaLabel="Close notification"
              >
                <div
                  className="dd-privacy-mask"
                  data-dd-action-name="Success Alert"
                >
                  {showSuccessAlertText}
                </div>
              </VaAlert>
            </div>
          ) : null}

          {/* Nested summary page view */}
          <ul className="vads-u-margin-top--2 vads-u-padding--0">
            {data.map((item, itemIndex) => {
              const itemName = getInternalText(
                'getItemName',
                data[itemIndex],
                props.fullData,
                itemIndex,
              );
              return (
                <li key={itemIndex} style={{ listStyleType: 'none' }}>
                  <va-card
                    id={`${props.name}_${itemIndex}`}
                    class={`vads-u-margin-bottom--2 vads-u-padding--2 ${
                      isIncomplete(itemIndex) ? 'has-incomplete-item-error' : ''
                    }`}
                    data-index={itemIndex}
                  >
                    <Element name={`card_${itemIndex}`} />
                    {isIncomplete(itemIndex) && (
                      <div className="vads-u-margin-bottom--1">
                        <span className="usa-label">INCOMPLETE</span>
                      </div>
                    )}
                    <Heading className="vads-u-font-size--h5 vads-u-margin-top--2">
                      {getInternalText(
                        'getItemName',
                        data[itemIndex],
                        props.fullData,
                        itemIndex,
                      )}
                    </Heading>
                    <div className="vads-u-flex--fill">
                      {getInternalText(
                        'cardDescription',
                        data[itemIndex],
                        props.fullData,
                        itemIndex,
                      )}
                      {isIncomplete(itemIndex) && (
                        <div className="vads-u-margin-top--2">
                          <VaAlert
                            status="error"
                            uswds
                            class="array-builder-missing-info-alert"
                          >
                            {getText(
                              'cardItemMissingInformation',
                              data[itemIndex],
                              props.fullData,
                              itemIndex,
                            )}
                          </VaAlert>
                        </div>
                      )}
                    </div>
                    <div className="vads-u-flex--fill vads-u-margin-top--2">
                      {props.onReviewPage ? null : (
                        <div className="vads-u-display--flex vads-u-align-items--center vads-u-justify-content--space-between">
                          <va-link
                            class="float-left"
                            active
                            href="#"
                            text="Edit"
                            label={`Edit ${itemName}`}
                            onClick={event => handleEdit(event, itemIndex)}
                          />
                          <VaButtonIcon
                            button-type="delete"
                            class="float-right"
                            label={`Delete ${itemName}`}
                            onClick={() =>
                              handleRemove(itemIndex, uiOptions.confirmRemove)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </va-card>
                </li>
              );
            })}
          </ul>
        </div>
        <VaModal
          clickToClose
          status="warning"
          data-dd-privacy="mask"
          data-dd-action-name="Delete Modal"
          modalTitle={getInternalText(
            'deleteTitle',
            data[removingIndex],
            data,
            removingIndex,
          )}
          primaryButtonText={getInternalText(
            'deleteYes',
            data[removingIndex],
            data,
            removingIndex,
          )}
          secondaryButtonText={getInternalText(
            'deleteNo',
            data[removingIndex],
            data,
            removingIndex,
          )}
          onCloseEvent={handleCloseRemoveModal}
          onPrimaryButtonClick={handleRemoveModal}
          onSecondaryButtonClick={handleCloseRemoveModal}
          visible={removingIndex !== false}
        >
          <>
            <div>
              {getInternalText(
                'deleteDescription',
                data[removingIndex],
                // data,
                data,
                removingIndex,
              )}
            </div>
          </>
        </VaModal>

        {/* Only show the 'Add another ..' button when another item can be added. This approach helps
            improve accessibility by removing unnecessary elements from the DOM when they are not relevant
            or interactable. */}
        {!hasMaxItems &&
          nestedArrayOptions.useLinkInsteadOfYesNo && (
            <div className={data?.length ? 'vads-u-margin-y--2' : ''}>
              <va-link-action
                class="wc-pattern-array-builder wc-pattern-array-builder-summary-add-link vads-web-component-pattern"
                text={
                  uiOptions?.summaryAddLinkText ||
                  `Do you have another ${nestedArrayOptions.nounSingular ||
                    'item'} to add?`
                }
                onClick={handleAdd}
              />
            </div>
          )}
        {!hasMaxItems &&
          !nestedArrayOptions.useLinkInsteadOfYesNo && (
            <VaRadio
              class="va-growable-add-btn vads-u-margin-y--4"
              label-header-level={headingLevel}
              label={
                uiOptions.addAnotherRadioLabel?.(props.data) ||
                `Do you want to add another ${nestedArrayOptions.nounSingular ||
                  'item'}?`
              }
              hint={
                schema.maxItems
                  ? `You can add ${schema.maxItems - data.length} items.`
                  : ''
              }
              required={isRequired}
              error={
                isRequired && pageSubmitted && !addAnotherValue
                  ? 'Select yes or no'
                  : ''
              }
              onVaValueChange={handleAddAnotherRadioChange}
            >
              <va-radio-option
                label={uiOptions.addYesLabel || 'Yes'}
                name="add-another"
                value="Y"
                checked={addAnotherValue === 'Y'}
              />
              <va-radio-option
                label={uiOptions.addNoLabel || 'No'}
                name="add-another"
                value="N"
                checked={addAnotherValue === 'N'}
              />
            </VaRadio>
          )}
        <NavSection />
      </div>
    );
  }

  CustomPage.propTypes = {
    name: PropTypes.string.isRequired,
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    NavButtons: PropTypes.func,
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
    pageContentBeforeButtons: PropTypes.node,
    pagePerItemIndex: PropTypes.string,
    path: PropTypes.string,
    required: PropTypes.bool,
    setFormData: PropTypes.func,
    title: PropTypes.string,
    trackingPrefix: PropTypes.string,
    uploadFile: PropTypes.func,
    onChange: PropTypes.func,
    onContinue: PropTypes.func,
    onReviewPage: PropTypes.bool,
    onSubmit: PropTypes.func,
  };

  return CustomPage;
}

ArrayBuilderInternalLoopPage.propTypes = {
  arrayPath: PropTypes.string.isRequired,
  getText: PropTypes.func.isRequired,
  modalDescription: PropTypes.string.isRequired,
  modalTitle: PropTypes.string.isRequired,
  nounPlural: PropTypes.string.isRequired,
  nounSingular: PropTypes.string.isRequired,
  required: PropTypes.func.isRequired,
  reviewRoute: PropTypes.string.isRequired,
  getIntroPath: PropTypes.func,
  getSummaryPath: PropTypes.func,
};
