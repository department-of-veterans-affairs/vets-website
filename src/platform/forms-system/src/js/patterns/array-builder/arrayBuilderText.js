/* eslint-disable no-unused-vars */
/** @type {ArrayBuilderText} */
export const DEFAULT_ARRAY_BUILDER_TEXT = {
  alertItemUpdated: props => {
    const itemName = props.getItemName(props.itemData);
    return itemName
      ? `${itemName}’s information has been updated`
      : `${props.nounSingular} information has been updated`;
  },
  alertItemDeleted: props => {
    const itemName = props.getItemName(props.itemData);
    return itemName
      ? `${itemName}’s information has been deleted`
      : `${props.nounSingular} information has been deleted`;
  },
  alertMinItems: props =>
    `You need to add at least ${props.itemData} ${
      props.minItems === 1 ? props.nounSingular : props.nounPlural
    }.`,
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
  cancelEditYes: props => `Yes, cancel`,
  cancelEditNo: props => `No, continue editing this ${props.nounSingular}`,
  cancelEditTitle: props => {
    const itemName = props.getItemName(props.itemData);
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
  editSaveButtonText: props => `Save and Continue`,
  getItemName: itemData => itemData?.name,
  deleteDescription: props => {
    const itemName = props.getItemName(props.itemData);
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
    const itemName = props.getItemName(props.itemData);
    return itemName
      ? `Delete ${itemName}’s information?`
      : `Delete this ${props.nounSingular}?`;
  },
  deleteYes: props => `Yes, delete this ${props.nounSingular}`,
  reviewAddButtonText: props => `Add another ${props.nounSingular}`,
  summaryTitle: props => `Review your ${props.nounPlural}`,
  yesNoBlankReviewQuestion: props =>
    `Do you have any ${props.nounPlural} to add?`,
};
