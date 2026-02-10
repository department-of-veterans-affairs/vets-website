import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import phoneUI from 'platform/forms-system/src/js/definitions/phone';
import emailUI from 'platform/forms-system/src/js/definitions/email';
import AddressViewField from 'platform/forms-system/src/js/components/AddressViewField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';

import ReviewCardField from 'platform/forms-system/src/js/components/ReviewCardField';

import {
  addressUI,
  addressSchema,
  updateFormDataAddress,
} from 'platform/forms-system/src/js/web-component-patterns';
import {
  contactInfoDescription,
  contactInfoUpdateHelpDescription,
  phoneEmailViewField,
} from '../content/contactInformation';

import { validateZIP } from '../validations';
import {
  shouldAutoDetectMilitary,
  shouldShowZipCode,
  createAddressValidator,
  hasInvalidPrefillData,
  updateCountrySchema,
  updateStateSchema,
  isStateRequired,
  isCountryRequired,
  shouldHideState,
} from '../utils/contactInformationHelpers';

const { phoneAndEmail } = fullSchema.properties;

const defaultAddressUI = {
  ...addressUI({
    keys: {
      street: 'addressLine1',
      street2: 'addressLine2',
      street3: 'addressLine3',
      postalCode: 'zipCode',
      isMilitary: 'view:livesOnMilitaryBase',
    },
    // Pass validations through addressUI's built-in support
    // This integrates properly with the platform's validation lifecycle
    validations: {
      street: [createAddressValidator('addressLine1')],
      street2: [createAddressValidator('addressLine2')],
      street3: [createAddressValidator('addressLine3')],
      city: [createAddressValidator('city')],
    },
  }),
};

/**
 * Update form data to remove selected military city & state and restore any
 * previously set city & state when the "I live on a U.S. military base"
 * checkbox is unchecked. See va.gov-team/issues/42216 for details
 * @param {object} oldFormData - Form data prior to interaction change
 * @param {object} formData - Form data after interaction change
 * @returns {object} - updated Form data with manipulated mailing address if the
 * military base checkbox state changes
 */
export const updateFormData = (oldFormData, formData) => {
  const updatedFormData = updateFormDataAddress(
    oldFormData,
    formData,
    ['mailingAddress'],
    null,
    {
      street: 'addressLine1',
      street2: 'addressLine2',
      street3: 'addressLine3',
      postalCode: 'zipCode',
      isMilitary: 'view:livesOnMilitaryBase',
    },
  );

  // Auto-detect military status based on city or state and set view:livesOnMilitaryBase accordingly
  if (shouldAutoDetectMilitary(oldFormData, updatedFormData)) {
    updatedFormData.mailingAddress['view:livesOnMilitaryBase'] = true;
  }

  return updatedFormData;
};

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description': contactInfoDescription,
  phoneAndEmail: {
    'ui:title': 'Phone & email',
    'ui:field': ReviewCardField,
    'ui:options': {
      viewComponent: phoneEmailViewField,
    },
    primaryPhone: phoneUI('Phone number'),
    emailAddress: emailUI(),
  },
  mailingAddress: {
    ...defaultAddressUI,
    'ui:title': 'Mailing address',
    'ui:field': ReviewCardField,
    'ui:options': {
      ...defaultAddressUI['ui:options'],
      viewComponent: AddressViewField,
      classNames:
        'vads-web-component-pattern vads-web-component-pattern-address',
      // Force edit mode when prefilled address data has invalid characters.
      // Uses the same normalized validation as createAddressValidator so that
      // extra spaces (which get collapsed) don't falsely trigger edit mode,
      // but genuinely disallowed characters do. maxLength is already handled
      // by the JSON schema via the `extend` option on addressSchema.
      startInEdit: hasInvalidPrefillData,
    },
    // Override country field to display 'USA' instead of 'United States'
    country: {
      ...defaultAddressUI.country,
      'ui:required': isCountryRequired,
      'ui:options': {
        ...defaultAddressUI.country['ui:options'],
        updateSchema: updateCountrySchema,
      },
    },
    state: {
      'ui:title': 'State',
      'ui:autocomplete': 'address-level1',
      'ui:webComponentField': VaSelectField,
      'ui:errorMessages': {
        required: 'Please select a state',
      },
      'ui:options': {
        hideIf: shouldHideState,
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        hideEmptyValueInReview: true,
        updateSchema: updateStateSchema,
      },
      'ui:required': isStateRequired,
    },
    zipCode: {
      ...defaultAddressUI.zipCode,
      'ui:required': shouldShowZipCode,
      'ui:validations': [validateZIP],
      'ui:errorMessages': {
        required: 'Please enter a postal code',
        pattern:
          'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
      },
      'ui:options': {
        classNames:
          'vads-web-component-pattern-field vads-web-component-pattern-address',
        widgetClassNames: 'usa-input-medium',
        hideIf: formData => !shouldShowZipCode(formData),
      },
    },
    // Keep explicit field definitions for review card display
    // Validations are handled via addressUI's validations option
    // Note: Only define fields we actually need to customize (addressLine1, city)
    // Do NOT add addressLine2/3 here - it breaks the platform's updateSchema for military labels
    addressLine1: {
      ...defaultAddressUI.addressLine1,
    },
    city: {
      ...defaultAddressUI.city,
      'ui:options': {
        ...defaultAddressUI.city['ui:options'],
      },
    },
  },
  'view:contactInfoDescription': {
    'ui:description': contactInfoUpdateHelpDescription,
  },
};

export const schema = {
  type: 'object',
  properties: {
    phoneAndEmail,
    mailingAddress: addressSchema({
      keys: {
        street: 'addressLine1',
        street2: 'addressLine2',
        street3: 'addressLine3',
        postalCode: 'zipCode',
        isMilitary: 'view:livesOnMilitaryBase',
      },
      // Restore 526EZ-specific maxLength so the JSON schema validator catches
      // invalid prefilled data at initial render. Without these, the platform
      // default (maxLength: 100) means ReviewCardField won't detect errors and
      // won't start in edit mode — leaving the user stuck on a view-only card
      // with hidden validation errors they can't see or fix.
      //
      // NOTE: Only maxLength is set here, NOT pattern. The pattern validation
      // is handled by createAddressValidator (ui:validations) which normalizes
      // spaces before checking — preventing false failures from consecutive
      // spaces in prefilled data and showing user-friendly error messages
      // instead of the raw regex pattern. (See PR #42005)
      extend: {
        street: { maxLength: 20 },
        street2: { maxLength: 20 },
        street3: { maxLength: 20 },
        city: {
          maxLength: fullSchema.definitions.address.properties.city.maxLength,
        },
      },
    }),
    'view:contactInfoDescription': {
      type: 'object',
      properties: {},
    },
  },
};
