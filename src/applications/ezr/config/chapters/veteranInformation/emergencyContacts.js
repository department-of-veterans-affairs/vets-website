import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  addressUI,
  addressSchema,
  fullNameUI,
  phoneUI,
  selectUI,
  titleUI,
  yesNoUI,
  yesNoSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';
import { isEmergencyContactsEnabled } from '../../../utils/helpers/form-config';

const {
  veteranContacts: { items: contact },
} = ezrSchema.properties;

const { fullName, primaryPhone, relationship, address } = contact.properties;

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
    getItemName: item => `${item?.fullName?.first} ${item?.fullName?.last}`,
    cardDescription: item => `${item?.primaryPhone}`,
    deleteTitle: _ => 'Remove',
    deleteYes: _ => 'Yes, remove this emergency contact',
    deleteDescription: item =>
      `This will remove ${item?.fullName?.first} ${
        item?.fullName?.last
      } and all the information from your list of emergency contacts.`,
  },
  depends: isEmergencyContactsEnabled,
};

const emergencyContactsPage = {
  uiSchema: {
    ...titleUI(
      content['emergency-contact-title'],
      content['emergency-contact-description'],
    ),
    fullName: fullNameUI(),
    primaryPhone: {
      ...phoneUI(content['emergency-contact-phone']),
      'ui:errorMessages': {
        required: content['phone-number-error-message'],
        pattern: content['phone-number-error-message'],
      },
    },
    relationship: selectUI({
      title: content['emergency-contact-relationship'],
      errorMessages: {
        required: content['emergency-contact-relationship-error-message'],
      },
    }),
    'view:hasEmergencyContactAddress': yesNoUI(
      content['emergency-contact-address-label'],
    ),
  },
  schema: {
    type: 'object',
    properties: {
      fullName,
      primaryPhone,
      relationship,
      'view:hasEmergencyContactAddress': yesNoSchema,
    },
    required: [
      'fullName',
      'primaryPhone',
      'relationship',
      'view:hasEmergencyContactAddress',
    ],
  },
};

const emergencyContactsAddressPage = {
  uiSchema: {
    ...titleUI(content['emergency-contact-address-title'], ' '),
    address: addressUI(),
  },
  schema: {
    type: 'object',
    properties: {
      address: merge({}, addressSchema(), {
        properties: address.properties,
      }),
    },
    required: ['address'],
  },
};

const summaryPage = {
  uiSchema: {
    'view:hasEmergencyContacts': arrayBuilderYesNoUI(arrayBuilderOptions, {
      title: content['emergency-contact-add-contacts-label'],
      labelHeaderLevel: 'p',
      hint: ' ',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmergencyContacts': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmergencyContacts'],
  },
};

const emergencyContactPages = arrayBuilderPages(
  arrayBuilderOptions,
  (pageBuilder, helpers) => ({
    emergencyContactsSummary: pageBuilder.summaryPage({
      title: content['emergency-contact-summary-title'],
      path: 'emergency-contacts-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    emergencyContactsPage: pageBuilder.itemPage({
      title: content['emergency-contact-title'],
      path: 'emergency-contacts/:index/contact',
      uiSchema: emergencyContactsPage.uiSchema,
      schema: emergencyContactsPage.schema,
      onNavForward: props => {
        return props.formData['view:hasEmergencyContactAddress']
          ? helpers.navForwardKeepUrlParams(props) // go to next page
          : helpers.navForwardFinishedItem(props); // return to summary
      },
    }),
    emergencyContactsAddressPage: pageBuilder.itemPage({
      title: content['emergency-contact-address-title'],
      path: 'emergency-contacts/:index/contact-address',
      uiSchema: emergencyContactsAddressPage.uiSchema,
      schema: emergencyContactsAddressPage.schema,
    }),
  }),
);

export default emergencyContactPages;
