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
import { hasEmergencyContactAddress } from '../../../utils/helpers/form-config';

const {
  veteranContacts: { items: contact },
} = ezrSchema.properties;

const { fullName, primaryPhone, relationship, address } = contact.properties;

const arrayBuilderOptions = {
  arrayPath: 'veteranContacts',
  nounSingular: 'emergency contact',
  nounPlural: 'emergency contacts',
  required: false,
  text: {
    getItemName: item => item?.fullName?.first,
  },
};

const emergencyContactsPage = {
  uiSchema: {
    ...titleUI(
      'Emergency Contact',
      'The person you want us to contact in an emergency. You can add up to two emergency contacts.',
    ),
    fullName: fullNameUI(),
    primaryPhone: {
      ...phoneUI(content['vet-home-phone-label']),
      'ui:errorMessages': {
        required: content['phone-number-error-message'],
        pattern: content['phone-number-error-message'],
      },
    },
    relationship: selectUI({
      title: "What is the emergency contact's relationship to you?",
      errorMessages: {
        required: 'Please select the relationship',
      },
    }),
    'view:hasEmergencyContactAddress': yesNoUI(
      "Do you want to share your emergency contact's address?",
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
    required: ['fullName', 'view:hasEmergencyContactAddress'],
  },
};

const emergencyContactsAddressPage = {
  uiSchema: {
    ...titleUI('Emergency Contact Address', ' '),
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
      title: 'Do you have emergency contacts to report?',
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
  pageBuilder => ({
    emergencyContactsSummary: pageBuilder.summaryPage({
      title: 'Review your emergency contacts',
      path: 'emergency-contacts-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    emergencyContactsPage: pageBuilder.itemPage({
      title: 'Emergency Contact',
      path: 'emergency-contacts/:index/contact',
      uiSchema: emergencyContactsPage.uiSchema,
      schema: emergencyContactsPage.schema,
    }),
    emergencyContactsAddressPage: pageBuilder.itemPage({
      title: 'Emergency Contact Address',
      path: 'emergency-contacts/:index/contact-address',
      depends: hasEmergencyContactAddress,
      uiSchema: emergencyContactsAddressPage.uiSchema,
      schema: emergencyContactsAddressPage.schema,
    }),
  }),
);

export default emergencyContactPages;
