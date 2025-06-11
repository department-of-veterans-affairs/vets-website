import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  getItemName,
  getCardDescription,
  getDeleteTitle,
  getDeleteYes,
  getDeleteDescription,
} from '../../../utils/helpers/emergencyContactUtils';
import content from '../../../locales/en/content.json';
import {
  emergencyContactsPage,
  emergencyContactsAddressPage,
  emergencyContactsSummaryPage,
} from '../../../definitions/emergencyContacts';

/**
 * Declare attributes for array builder pattern
 * @type {ArrayBuilderOptions}
 */
const arrayBuilderOptions = {
  arrayPath: 'emergencyContacts',
  nounSingular: 'emergency contact',
  nounPlural: 'emergency contact',
  required: false,
  maxItems: 1,
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
      content['emergency-contact-cancel-add-description-text'],
    cancelEditDescription: () =>
      content['emergency-contact-cancel-edit-description-text'],
    cancelEditTitle: () => content['emergency-contact-cancel-edit-title-text'],
    cancelAddTitle: () => content['emergency-contact-cancel-add-title-text'],
    cancelAddYes: () => content['emergency-contact-cancel-add-yes'],
    cancelAddNo: () => content['emergency-contact-cancel-add-no'],
    cancelEditYes: () => content['emergency-contact-cancel-edit-yes'],
    cancelEditNo: () => content['emergency-contact-cancel-edit-no'],
    yesNoBlankReviewQuestion: () =>
      content['emergency-contact-summary-yes-no-blank-review-question'],
    reviewAddButtonText: () =>
      content['emergency-contact-summary-add-button-text'],
  },
  hideMaxItemsAlert: true,
};

// build schemas based on declared options
const emergencyContactsSummaryPageSchemas = emergencyContactsSummaryPage(
  arrayBuilderOptions,
);
const emergencyContactsPageSchemas = emergencyContactsPage(arrayBuilderOptions);
const emergencyContactsAddressPageSchemas = emergencyContactsAddressPage(
  arrayBuilderOptions,
);

/**
 * build list of pages to populate in the form config
 * @returns {ArrayBuilderPages}
 */
const emergencyContactPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    emergencyContactsSummary: pageBuilder.summaryPage({
      title: content['emergency-contact-summary-title'],
      path: 'veteran-information/emergency-contacts-summary',
      uiSchema: emergencyContactsSummaryPageSchemas.uiSchema,
      schema: emergencyContactsSummaryPageSchemas.schema,
    }),
    emergencyContactsPage: pageBuilder.itemPage({
      title: content['emergency-contact-title'],
      path: 'veteran-information/emergency-contacts/:index/contact',
      uiSchema: emergencyContactsPageSchemas.uiSchema,
      schema: emergencyContactsPageSchemas.schema,
      onNavForward: props => {
        return props.formData.emergencyContacts[props.index][
          'view:hasEmergencyContactAddress'
        ]
          ? helpers.navForwardKeepUrlParams(props) // go to next page
          : helpers.navForwardFinishedItem(props); // return to summary
      },
    }),
    emergencyContactsAddressPage: pageBuilder.itemPage({
      title: content['emergency-contact-address-title'],
      path: 'veteran-information/emergency-contacts/:index/contact-address',
      uiSchema: emergencyContactsAddressPageSchemas.uiSchema,
      schema: emergencyContactsAddressPageSchemas.schema,
    }),
  }),
);

export default emergencyContactPages;
