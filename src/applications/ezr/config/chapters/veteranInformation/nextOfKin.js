import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  getItemName,
  getCardDescription,
  getDeleteTitle,
  getDeleteYes,
  getDeleteDescription,
} from '../../../utils/helpers/nextOfKinUtils';
import content from '../../../locales/en/content.json';
import {
  nextOfKinPage,
  nextOfKinAddressPage,
  nextOfKinSummaryPage,
} from '../../../definitions/nextOfKin';
import { MAX_NEXT_OF_KINS } from '../../../utils/constants';

/**
 * Declare attributes for array builder pattern
 * @type {ArrayBuilderOptions}
 */
const arrayBuilderOptions = {
  arrayPath: 'nextOfKins',
  nounSingular: 'next of kin',
  nounPlural: 'next of kins',
  required: false,
  maxItems: MAX_NEXT_OF_KINS,
  hideMaxItemsAlert: true,
  isItemIncomplete: item =>
    !item?.fullName?.first ||
    !item?.fullName?.last ||
    !item?.primaryPhone ||
    !item?.relationship,
  text: {
    getItemName,
    cardDescription: getCardDescription,
    deleteTitle: getDeleteTitle,
    deleteYes: getDeleteYes,
    deleteDescription: getDeleteDescription,
    cancelAddDescription: () =>
      content['next-of-kin-cancel-add-description-text'],
    cancelEditDescription: () =>
      content['next-of-kin-cancel-edit-description-text'],
    cancelAddYes: () => content['next-of-kin-cancel-add-yes'],
    cancelAddNo: () => content['next-of-kin-cancel-add-no'],
    cancelEditNo: () => content['next-of-kin-cancel-edit-no'],
    cancelEditYes: () => content['next-of-kin-cancel-edit-yes'],
    cancelAddTitle: () => content['next-of-kin-cancel-add-title-text'],
    cancelEditTitle: () => content['next-of-kin-cancel-edit-title-text'],
    yesNoBlankReviewQuestion: () =>
      content['next-of-kin-summary-yes-no-blank-review-question'],
    reviewAddButtonText: () => content['next-of-kin-summary-add-button-text'],
  },
};

// build schemas based on declared options
const summaryPageSchemas = nextOfKinSummaryPage(arrayBuilderOptions);
const pageSchemas = nextOfKinPage(arrayBuilderOptions);
const addressPageSchemas = nextOfKinAddressPage(arrayBuilderOptions);

/**
 * build list of pages to populate in the form config
 * @returns {ArrayBuilderPages}
 */
const nextOfKinPages = arrayBuilderPages(arrayBuilderOptions, pageBuilder => ({
  nextOfKinSummary: pageBuilder.summaryPage({
    title: content['next-of-kin-summary-title'],
    path: 'veteran-information/next-of-kin-summary',
    uiSchema: summaryPageSchemas.uiSchema,
    schema: summaryPageSchemas.schema,
  }),
  nextOfKinPage: pageBuilder.itemPage({
    title: content['next-of-kin-title'],
    path: 'veteran-information/next-of-kin/:index/contact',
    uiSchema: pageSchemas.uiSchema,
    schema: pageSchemas.schema,
  }),
  nextOfKinAddressPage: pageBuilder.itemPage({
    title: content['next-of-kin-address-title'],
    path: 'veteran-information/next-of-kin/:index/contact-address',
    uiSchema: addressPageSchemas.uiSchema,
    schema: addressPageSchemas.schema,
  }),
}));

export default nextOfKinPages;
