/* eslint-disable no-unused-vars */
/**
 * @typedef {{
 *   getItemName: (itemData: any) => string,
 *   itemData: any,
 *   nounPlural: string,
 *   nounSingular: string,
 * }} TextProps
 */

/**
 * @typedef {{
 *   alertItemUpdated?: (props: TextProps) => string,
 *   alertMaxItems?: (props: TextProps) => string,
 *   cancelButtonText?: (props: TextProps) => string,
 *   cancelDescription?: (props: TextProps) => string,
 *   cancelNo?: (props: TextProps) => string,
 *   cancelTitle?: (props: TextProps) => string,
 *   cancelYes?: (props: TextProps) => string,
 *   cardDescription?: (props: TextProps) => string,
 *   cardItemMissingInformation?: (itemData: any) => string,
 *   getItemName?: (itemData: any) => string,
 *   removeDescription?: (props: TextProps) => string,
 *   removeNeedAtLeastOneDescription?: (props: TextProps) => string,
 *   removeNo?: (props: TextProps) => string,
 *   removeTitle?: (props: TextProps) => string,
 *   removeYes?: (props: TextProps) => string,
 *   reviewAddButtonText?: (props: TextProps) => string,
 *   summaryTitle?: (props: TextProps) => string,
 * }} ArrayBuilderText
 */

/**
 * @typedef {keyof ArrayBuilderText} ArrayBuilderTextKey
 */

/**
 * @typedef {(key: ArrayBuilderTextKey, itemData) => string} ArrayBuilderGetText
 */

/** @type {ArrayBuilderText} */
export const DEFAULT_ARRAY_BUILDER_TEXT = {
  alertItemUpdated: props =>
    `${props.getItemName(props.itemData)}’s information has been updated`,
  alertMaxItems: props =>
    `You have added the maximum number of allowed ${
      props.nounPlural
    } for this application. You may edit or remove your options or choose to continue on in the application.`,
  cancelButtonText: props => `Cancel adding this ${props.nounSingular}`,
  cancelDescription: props =>
    `If you cancel, you’ll lose the information you entered about this ${
      props.nounPlural
    }.`,
  cancelNo: props => `No, continue adding this ${props.nounSingular}`,
  cancelTitle: props => `Cancel adding this ${props.nounSingular}?`,
  cancelYes: props => `Yes, cancel`,
  cardDescription: itemData => '',
  cardItemMissingInformation: props =>
    `This ${
      props.nounSingular
    } is missing information. Edit and complete this ${
      props.nounSingular
    }’s information before continuing.`,
  getItemName: itemData => itemData?.name,
  removeDescription: props =>
    `This will remove ${props.getItemName(
      props.itemData,
    )} and all the information from your list of ${props.nounPlural}.`,
  removeNeedAtLeastOneDescription: props =>
    `If you remove this ${
      props.nounSingular
    }, we’ll take you to a screen where you can add another ${
      props.nounSingular
    }. You’ll need to list at least one ${
      props.nounSingular
    } for us to process this form.`,
  removeNo: props => `No, keep this ${props.nounSingular}`,
  removeTitle: props =>
    `Are you sure you want to remove this ${props.nounSingular}?`,
  removeYes: props => `Yes, remove this ${props.nounSingular}`,
  reviewAddButtonText: props => `Add another ${props.nounSingular}`,
  summaryTitle: props => `Review your ${props.nounPlural}`,
};
