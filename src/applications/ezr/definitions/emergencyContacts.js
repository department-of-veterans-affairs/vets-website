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
  arrayBuilderItemFirstPageTitleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import content from '../locales/en/content.json';

const {
  emergencyContacts: { items: contact },
} = ezrSchema.properties;

const {
  fullName,
  primaryPhone,
  relationship,
  address,
  contactType,
} = contact.properties;

/**
 * Declare schema attributes for emergency contacts page
 * @returns {PageSchema}
 */
export const emergencyContactsPage = () => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: content['emergency-contact-title'],
      showEditExplanationText: false,
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
    contactType: {
      ...selectUI({ title: 'Default relationship type', inert: true }),
    },
  },
  schema: {
    type: 'object',
    properties: {
      fullName,
      primaryPhone,
      relationship,
      contactType: {
        ...contactType,
        default: contactType.enum[0],
      },
    },
    required: ['fullName', 'primaryPhone', 'relationship', 'contactType'],
  },
});

/**
 * Declare schema attributes for emergency contact address page
 * @returns {PageSchema}
 */
export const emergencyContactsAddressPage = () => ({
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
  },
});

/**
 * Declare schema attributes for emergency contact summary page
 * @returns {PageSchema}
 */
export const emergencyContactsSummaryPage = (options = {}) => ({
  uiSchema: {
    'view:hasEmergencyContacts': arrayBuilderYesNoUI(
      options,
      {
        title: content['emergency-contact-add-contacts-label'],
        hint: content['emergency-contact-hint-text'],
        labels: {
          Y: content.yes,
          N: content.no,
        },
      },
      {
        title: content['emergency-contact-add-another-contact-label'],
        hint: content['emergency-contact-hint-text'],
        labels: {
          Y: content.yes,
          N: content.no,
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmergencyContacts': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmergencyContacts'],
  },
});
