/* eslint-disable no-unused-vars */
/**
 * Default text values for Array Builder that you can override
 *
 * ```js
 * const options = {
 *   ...
 *   text: {
 *     getItemName: (item, index, fullData) => item.name,
 *     cardDescription: item => `${formatReviewDate(item?.date)}`,
 *     ...etc
 *   },
 * };
 *
 * arrayBuilderPages(options, ...)
 * ```
 *
 * To see ALL available text override options, refer to:
 * `src/platform/forms-system/src/js/types.js`
 *
 * @type {ArrayBuilderText}
 */
export const DEFAULT_ARRAY_BUILDER_TEXT = {
  alertItemUpdated: props => {
    const itemName = props.getItemName(
      props.itemData,
      props.index,
      props.formData,
    );
    return itemName
      ? `${itemName}’s information has been updated`
      : `${props.nounSingular} information has been updated`;
  },
  alertItemDeleted: props => {
    const itemName = props.getItemName(
      props.itemData,
      props.index,
      props.formData,
    );
    return itemName
      ? `${itemName}’s information has been deleted`
      : `${props.nounSingular} information has been deleted`;
  },
  alertMaxItems: props =>
    `You have added the maximum number of allowed ${
      props.nounPlural
    } for this application. You may edit or delete a ${
      props.nounSingular
    } or choose to continue on in the application.`,
  cancelAddButtonText: props => `Cancel adding this ${props.nounSingular}`,
  cancelAddDescription: props =>
    `If you cancel, you’ll lose the information you entered about this ${
      props.nounSingular
    }.`,
  cancelAddReviewDescription: props =>
    `If you cancel, you’ll lose the information you entered about this ${
      props.nounSingular
    } and you will be returned to the form review page.`,
  cancelAddYes: props => `Yes, cancel`,
  cancelAddNo: props => `No, continue adding this ${props.nounSingular}`,
  cancelAddTitle: props => {
    const itemName = props.getItemName(
      props.itemData,
      props.index,
      props.formData,
    );
    return itemName
      ? `Cancel adding ${itemName}`
      : `Cancel adding this ${props.nounSingular}`;
  },
  cancelEditButtonText: props => `Cancel`,
  cancelEditDescription: props =>
    `If you cancel, you’ll lose any changes you made on this screen and you will be returned to the ${
      props.nounPlural
    } review page.`,
  cancelEditReviewDescription: props =>
    `If you cancel, you’ll lose any changes you made on this screen and you will be returned to the form review page.`,
  cancelEditYes: props => `Yes, cancel`,
  cancelEditNo: props => `No, continue editing this ${props.nounSingular}`,
  cancelEditTitle: props => {
    const itemName = props.getItemName(
      props.itemData,
      props.index,
      props.formData,
    );
    return itemName
      ? `Cancel editing ${itemName}`
      : `Cancel editing this ${props.nounSingular}`;
  },
  cardDescription: itemData => '',
  cardItemMissingInformation: props =>
    `This ${
      props.nounSingular
    } is missing information. Edit and complete this ${
      props.nounSingular
    }’s information before continuing.`,
  editSaveButtonText: props => `Save and continue`,
  getItemName: (itemData, index, formData) => itemData?.name,
  deleteDescription: props => {
    const itemName = props.getItemName(
      props.itemData,
      props.index,
      props.formData,
    );
    return itemName
      ? `This will delete ${itemName} and all the information from your list of ${
          props.nounPlural
        }.`
      : `This will delete this ${
          props.nounSingular
        } and all the information from your list of ${props.nounPlural}.`;
  },
  deleteNeedAtLeastOneDescription: props =>
    `If you delete this ${
      props.nounSingular
    }, we’ll take you to a screen where you can add another ${
      props.nounSingular
    }. You’ll need to list at least one ${
      props.nounSingular
    } for us to process this form.`,
  deleteNo: props => `No, keep this ${props.nounSingular}`,
  deleteTitle: props => {
    const itemName = props.getItemName(
      props.itemData,
      props.index,
      props.formData,
    );
    return itemName
      ? `Delete ${itemName}’s information?`
      : `Delete this ${props.nounSingular}?`;
  },
  deleteYes: props => `Yes, delete this ${props.nounSingular}`,

  reviewAddButtonText: props => `Add another ${props.nounSingular}`,
  summaryAddButtonText: props => `Add ${props.nounSingular}`,
  summaryAddLinkText: props => `Add ${props.nounSingular}`,
  summaryTitle: props => `Review your ${props.nounPlural}`,
  summaryTitleWithoutItems: props => null, // No title by default - only arrayBuilderYesNoUI question
  summaryDescription: props => null, // string or JSX/React
  summaryDescriptionWithoutItems: props => null, // string or JSX/React
  yesNoBlankReviewQuestion: props =>
    `Do you have any ${props.nounPlural} to add?`,

  duplicateModalTitle: props => 'Potential duplicate',
  duplicateModalDescription: props =>
    `You’ve entered multiple ${
      props.nounPlural
    } with this information. Are you adding a different ${
      props.nounSingular
    }, or is this a duplicate?`,
  duplicateModalPrimaryButtonText: props => 'Don’t add, it’s a duplicate',
  duplicateModalSecondaryButtonText: props =>
    `Add, it’s a different ${props.nounSingular}`,
  duplicateSummaryCardLabel: props => 'POSSIBLE DUPLICATE',
  duplicateSummaryCardInfoAlert: props =>
    `You may have multiple ${props.nounPlural} with this same information.`,
  duplicateSummaryCardWarningOrErrorAlert: props =>
    `You may have entered multiple ${
      props.nounPlural
    } with this same information.
      Before continuing, review these entries and delete any duplicates.`,
};
