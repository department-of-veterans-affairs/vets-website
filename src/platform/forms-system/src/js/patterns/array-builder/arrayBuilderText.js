/* eslint-disable no-unused-vars */
/** @type {ArrayBuilderText} */
export const DEFAULT_ARRAY_BUILDER_TEXT = {
  alertItemUpdated: props => {
    const itemName = props.getItemName(props.itemData);
    return itemName
      ? `${itemName}’s information has been updated`
      : `${props.nounSingular} information has been updated`;
  },
  alertItemRemoved: props => {
    const itemName = props.getItemName(props.itemData);
    return itemName
      ? `${itemName}’s information has been removed`
      : `${props.nounSingular} information has been removed`;
  },
  alertMaxItems: props =>
    `You have added the maximum number of allowed ${
      props.nounPlural
    } for this application. You may edit or remove your options or choose to continue on in the application.`,
  cancelAddButtonText: props => `Cancel adding this ${props.nounSingular}`,
  cancelAddDescription: props =>
    `If you cancel, you’ll lose the information you entered about this ${
      props.nounSingular
    }.`,
  cancelAddReviewDescription: props =>
    `If you cancel, you’ll lose the information you entered about this ${
      props.nounSingular
    } and you will be returned to the form review page.`,
  cancelAddNo: props => `No, continue adding this ${props.nounSingular}`,
  cancelAddTitle: props => {
    const itemName = props.getItemName(props.itemData);
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
  cancelEditNo: props => `No, continue editing this ${props.nounSingular}`,
  cancelEditTitle: props => {
    const itemName = props.getItemName(props.itemData);
    return itemName
      ? `Cancel editing ${itemName}`
      : `Cancel editing this ${props.nounSingular}`;
  },
  cancelYes: props => `Yes, cancel`,
  cardDescription: itemData => '',
  cardItemMissingInformation: props =>
    `This ${
      props.nounSingular
    } is missing information. Edit and complete this ${
      props.nounSingular
    }’s information before continuing.`,
  editSaveButtonText: props => `Save and Continue`,
  getItemName: itemData => itemData?.name,
  removeDescription: props => {
    const itemName = props.getItemName(props.itemData);
    return itemName
      ? `This will remove ${itemName} and all the information from your list of ${
          props.nounPlural
        }.`
      : `This will remove this ${
          props.nounSingular
        } and all the information from your list of ${props.nounPlural}.`;
  },
  removeNeedAtLeastOneDescription: props =>
    `If you remove this ${
      props.nounSingular
    }, we’ll take you to a screen where you can add another ${
      props.nounSingular
    }. You’ll need to list at least one ${
      props.nounSingular
    } for us to process this form.`,
  removeNo: props => `No, keep this ${props.nounSingular}`,
  removeTitle: props => {
    const itemName = props.getItemName(props.itemData);
    return itemName
      ? `Are you sure you want to remove ${itemName}?`
      : `Are you sure you want to remove this ${props.nounSingular}?`;
  },
  removeYes: props => `Yes, remove this ${props.nounSingular}`,
  reviewAddButtonText: props => `Add another ${props.nounSingular}`,
  summaryTitle: props => `Review your ${props.nounPlural}`,
  yesNoBlankReviewQuestion: props =>
    `Do you have any ${props.nounPlural} to add?`,
};
