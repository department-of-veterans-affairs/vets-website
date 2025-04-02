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
  arrayPath: 'veteranContacts',
  nounSingular: 'next of kin',
  nounPlural: 'next of kins',
  required: false,
  maxItems: MAX_NEXT_OF_KINS,
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
const nextOfKinPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
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
      onNavForward: props => {
        return props.formData['view:hasNextOfKinAddress']
          ? helpers.navForwardKeepUrlParams(props) // go to next page
          : helpers.navForwardFinishedItem(props); // return to summary
      },
    }),
    nextOfKinAddressPage: pageBuilder.itemPage({
      title: content['next-of-kin-address-title'],
      path: 'veteran-information/next-of-kin/:index/contact-address',
      uiSchema: addressPageSchemas.uiSchema,
      schema: addressPageSchemas.schema,
    }),
  }),
);

export default nextOfKinPages;
