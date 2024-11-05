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
  summaryPage,
} from '../../../definitions/emergencyContacts';

/**
 * Declare attributes for array builder pattern
 * @type {ArrayBuilderOptions}
 */
const arrayBuilderOptions = {
  arrayPath: 'veteranContacts',
  nounSingular: 'emergency contact',
  nounPlural: 'emergency contacts',
  required: false,
  maxItems: 2,
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
const summaryPageSchemas = summaryPage(arrayBuilderOptions);
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
      uiSchema: summaryPageSchemas.uiSchema,
      schema: summaryPageSchemas.schema,
    }),
    emergencyContactsPage: pageBuilder.itemPage({
      title: content['emergency-contact-title'],
      path: 'veteran-information/emergency-contacts/:index/contact',
      uiSchema: emergencyContactsPageSchemas.uiSchema,
      schema: emergencyContactsPageSchemas.schema,
      onNavForward: props => {
        return props.formData['view:hasEmergencyContactAddress']
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
