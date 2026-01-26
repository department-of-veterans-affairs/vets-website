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
  nextOfKins: { items: contact },
} = ezrSchema.properties;

const {
  fullName,
  primaryPhone,
  relationship,
  contactType,
  address,
} = contact.properties;

/**
 * Declare schema attributes for next of kins page
 * @returns {PageSchema}
 */
export const nextOfKinPage = () => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: content['next-of-kin-title'],
      showEditExplanationText: false,
    }),
    fullName: fullNameUI(title => `Next of kin's ${title}`, {
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
      ...phoneUI(content['next-of-kin-phone']),
      'ui:errorMessages': {
        required: content['phone-number-error-message'],
        pattern: content['phone-number-error-message'],
      },
    },
    relationship: selectUI({
      title: content['next-of-kin-relationship'],
      errorMessages: {
        required: content['next-of-kin-relationship-error-message'],
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
 * Declare schema attributes for next of kin address page
 * @returns {PageSchema}
 */
export const nextOfKinAddressPage = () => ({
  uiSchema: {
    ...titleUI(content['next-of-kin-address-title'], ' '),
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
 * Declare schema attributes for next of kin summary page
 * @returns {PageSchema}
 */
export const nextOfKinSummaryPage = (options = {}) => ({
  uiSchema: {
    'view:hasNextOfKin': arrayBuilderYesNoUI(
      options,
      {
        title: content['next-of-kin-add-contacts-label'],
        hint: content['next-of-kin-hint-text'],
        labels: {
          Y: content['next-of-kin-add-contacts-yes-label'],
          N: content['next-of-kin-add-contacts-no-label'],
        },
      },
      {
        title: content['next-of-kin-add-another-contact-label'],
        hint: content['next-of-kin-hint-text'],
        labels: {
          Y: content['next-of-kin-add-another-contact-yes-label'],
          N: content['next-of-kin-add-another-contact-no-label'],
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasNextOfKin': arrayBuilderYesNoSchema,
    },
    required: ['view:hasNextOfKin'],
  },
});
