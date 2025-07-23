import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  getItemName,
  getCardDescription,
  getDeleteTitle,
  getDeleteYes,
  getDeleteNo,
  getDeleteDescription,
  isItemIncomplete,
} from '../../../utils/helpers/emergencyContactUtils';
import content from '../../../locales/en/content.json';
import {
  emergencyContactsPage,
  emergencyContactsAddressPage,
  emergencyContactsSummaryPage,
} from '../../../definitions/emergencyContacts';
import { MAX_EMERGENCY_CONTACTS } from '../../../utils/constants';
import EmergencyContactsMaxAlert from '../../../components/FormAlerts/EmergencyContactsMaxAlert';

/**
 * Declare attributes for array builder pattern
 * @type {ArrayBuilderOptions}
 */
const arrayBuilderOptions = {
  arrayPath: 'emergencyContacts',
  nounSingular: 'emergency contact',
  nounPlural: 'emergency contacts',
  required: false,
  maxItems: MAX_EMERGENCY_CONTACTS,
  hideMaxItemsAlert: false,
  isItemIncomplete,
  text: {
    getItemName,
    cardDescription: getCardDescription,
    deleteTitle: getDeleteTitle,
    deleteYes: getDeleteYes,
    deleteNo: getDeleteNo,
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
    alertMaxItems: EmergencyContactsMaxAlert,
  },
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
  pageBuilder => ({
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
