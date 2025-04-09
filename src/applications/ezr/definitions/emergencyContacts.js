import merge from 'lodash/merge';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
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
  arrayBuilderItemFirstPageTitleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';

const {
  veteranContacts: { items: contact },
} = ezrSchema.properties;

const { fullName, primaryPhone, relationship, address } = contact.properties;

/**
 * Declare schema attributes for emergency contacts page
 * @returns {PageSchema}
 */
export const emergencyContactsPage = options => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: content['emergency-contact-title'],
      nounSingular: options.nounSingular,
    }),
    fullName: fullNameUI(title => `Emergency contact's ${title}`, {
      first: {
        'ui:errorMessages': {
          required: 'Please enter a first name',
        },
      },
      last: {
        'ui:errorMessages': {
          required: 'Please enter a last name',
        },
      },
    }),
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
});

/**
 * Declare schema attributes for emergency contact address page
 * @returns {PageSchema}
 */
export const emergencyContactsAddressPage = () => ({
  uiSchema: {
    ...titleUI(content['emergency-contact-address-title'], ' '),
    address: addressUI({
      labels: {
        militaryCheckbox: content['emergency-contact-military-checkbox'],
      },
    }),
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
});

/**
 * Declare schema attributes for emergency contact summary page
 * @returns {PageSchema}
 */
export const summaryPage = (options = {}) => ({
  uiSchema: {
    'view:isEmergencyContactsEnabled': arrayBuilderYesNoUI(options, {
      title: content['emergency-contact-add-contacts-label'],
      labelHeaderLevel: 'p',
      hint: ' ',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isEmergencyContactsEnabled': arrayBuilderYesNoSchema,
    },
    required: ['view:isEmergencyContactsEnabled'],
  },
});
