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
export const nextOfKinPage = options => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: content['next-of-kin-title'],
      nounSingular: options.nounSingular,
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
    'view:hasNextOfKinAddress': yesNoUI({
      title: content['next-of-kin-address-label'],
      hint: content['next-of-kin-address-hint'],
    }),
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
      'view:hasNextOfKinAddress': yesNoSchema,
    },
    required: [
      'fullName',
      'primaryPhone',
      'relationship',
      'contactType',
      'view:hasNextOfKinAddress',
    ],
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
    required: ['address'],
  },
});

/**
 * Declare schema attributes for next of kin summary page
 * @returns {PageSchema}
 */
export const nextOfKinSummaryPage = (options = {}) => ({
  uiSchema: {
    'view:hasNextOfKin': arrayBuilderYesNoUI(options, {
      title: content['next-of-kin-add-contacts-label'],
      titleHeaderLevel: 'h2',
      hint: content['next-of-kin-hint-text'],
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasNextOfKin': arrayBuilderYesNoSchema,
    },
    required: ['view:hasNextOfKin'],
  },
});
