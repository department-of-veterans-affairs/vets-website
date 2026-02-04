import VaRadioField from 'platform/forms-system/src/js/web-component-fields/VaRadioField';
import VaSelectField from 'platform/forms-system/src/js/web-component-fields/VaSelectField';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import constants from 'vets-json-schema/dist/constants.json';

import {
  MILITARY_STATE_LABELS,
  MILITARY_STATE_VALUES,
  MILITARY_CITIES,
} from '../constants';

/**
 * Filter and process countries for the contact information form
 * @returns {object} Object with COUNTRY_VALUES and COUNTRY_NAMES arrays
 */
export const getCountryOptions = () => {
  const schemaCountries = fullSchema.definitions.country.enum;

  // Filter countries to only include those in the schema, plus USA for "United States"
  const filteredCountries = constants.countries.filter(
    country =>
      schemaCountries.includes(country.label) ||
      country.label === 'United States',
  );

  // Extract values and names, ensuring USA stays as "USA"
  const COUNTRY_VALUES = filteredCountries.map(country => country.value);
  const COUNTRY_NAMES = filteredCountries.map(
    country => (country.label === 'United States' ? 'USA' : country.label),
  );

  return { COUNTRY_VALUES, COUNTRY_NAMES };
};

/**
 * Filter out military states from regular state options
 * @returns {object} Object with STATE_VALUES and STATE_LABELS arrays
 */
export const getRegularStateOptions = () => {
  const filteredStates = constants.states.USA.filter(
    state => !MILITARY_STATE_VALUES.includes(state.value),
  );
  const STATE_VALUES = filteredStates.map(state => state.value);
  const STATE_LABELS = filteredStates.map(state => state.label);

  return { STATE_VALUES, STATE_LABELS };
};

/**
 * Determine if a city or state indicates military address
 * @param {string} city - City name
 * @param {string} state - State code
 * @returns {boolean} True if military location detected
 */
export const isMilitaryLocation = (city, state) => {
  const isMilitaryCity =
    typeof city === 'string' &&
    MILITARY_CITIES.includes(city.trim().toUpperCase());
  const isMilitaryState =
    typeof state === 'string' &&
    MILITARY_STATE_VALUES.includes(state.trim().toUpperCase());
  return isMilitaryCity || isMilitaryState;
};

/**
 * Determine if military status should be auto-detected and set
 * @param {object} oldFormData - Previous form data
 * @param {object} updatedFormData - Current form data
 * @returns {boolean} True if military flag should be auto-set
 */
export const shouldAutoDetectMilitary = (oldFormData, updatedFormData) => {
  if (!updatedFormData.mailingAddress) {
    return false;
  }

  const { city, state } = updatedFormData.mailingAddress;
  const oldMilitaryFlag =
    oldFormData.mailingAddress?.['view:livesOnMilitaryBase'];
  const newMilitaryFlag =
    updatedFormData.mailingAddress['view:livesOnMilitaryBase'];

  // Only auto-set the flag if:
  // 1. Military city/state is detected AND
  // 2. The flag wasn't explicitly changed by the user (old and new values are the same) AND
  // 3. The flag is currently false (to avoid overriding explicit unchecking)
  return (
    isMilitaryLocation(city, state) &&
    oldMilitaryFlag === newMilitaryFlag &&
    !newMilitaryFlag
  );
};

/**
 * Helper function to determine if zipCode should be shown/required
 * @param {object} formData - Form data
 * @returns {boolean} True if zip code should be shown
 */
export const shouldShowZipCode = formData => {
  const isMilitary = formData.mailingAddress?.['view:livesOnMilitaryBase'];
  const isUSA = formData.mailingAddress?.country === 'USA';
  return isMilitary || isUSA;
};

// Patterns from vets-json-schema 21-526EZ-ALLCLAIMS-schema.json definitions.address
const ADDRESS_LINE_PATTERN = new RegExp(
  fullSchema.definitions.address.properties.addressLine1.pattern,
);
const CITY_PATTERN = new RegExp(
  fullSchema.definitions.address.properties.city.pattern,
);

/**
 * Normalize address line by:
 * - Trimming leading/trailing spaces
 * - Collapsing multiple consecutive spaces into a single space
 * @param {string} value - The address line value
 * @returns {string} Normalized value
 */
export const normalizeAddressLine = value => {
  if (!value) return value;
  return value.trim().replace(/\s{2,}/g, ' ');
};

// Field configurations for address validation
const ADDRESS_FIELD_CONFIG = {
  addressLine1: {
    maxLength: 20,
    fieldName: 'Address line 1',
    pattern: ADDRESS_LINE_PATTERN,
    allowedChars: "' . , & # -",
  },
  addressLine2: {
    maxLength: 20,
    fieldName: 'Address line 2',
    pattern: ADDRESS_LINE_PATTERN,
    allowedChars: "' . , & # -",
  },
  addressLine3: {
    maxLength: 20,
    fieldName: 'Address line 3',
    pattern: ADDRESS_LINE_PATTERN,
    allowedChars: "' . , & # -",
  },
  city: {
    maxLength: 30,
    fieldName: 'City',
    pattern: CITY_PATTERN,
    allowedChars: "' . # -",
  },
};

/**
 * Create address field validation function (works for address lines and city)
 * Validates against normalized value so extra spaces don't cause false failures
 * @param {string} fieldKey - Field key: 'addressLine1', 'addressLine2', 'addressLine3', or 'city'
 * @returns {function} Validation function
 */
export const createAddressValidator = fieldKey => {
  const config = ADDRESS_FIELD_CONFIG[fieldKey];
  if (!config) {
    throw new Error(
      `Invalid field key: ${fieldKey}. Must be one of: ${Object.keys(
        ADDRESS_FIELD_CONFIG,
      ).join(', ')}`,
    );
  }

  const { maxLength, fieldName, pattern, allowedChars } = config;

  return (errors, value) => {
    if (value) {
      // Normalize the value before validation (trim spaces, collapse duplicates)
      // Actual normalization happens at submit time in cleanUpMailingAddress
      const normalizedValue = normalizeAddressLine(value);

      if (normalizedValue.length > maxLength) {
        errors.addError(`${fieldName} must be ${maxLength} characters or less`);
      }
      if (!pattern.test(normalizedValue)) {
        // Provide a more helpful error message for city field with commas
        // (common user mistake: entering "City, State" in the city field)
        if (fieldKey === 'city' && normalizedValue.includes(',')) {
          errors.addError(
            'Please enter only the city name. Do not include the state, zip code, or country.',
          );
        } else {
          errors.addError(
            `${fieldName} may only contain letters, numbers, spaces, and these special characters: ${allowedChars}`,
          );
        }
      }
    }
  };
};

/**
 * Determine if the current form state indicates military address for UI purposes
 * @param {object} formData - Form data
 * @returns {boolean} True if military UI should be shown
 */
export const shouldShowMilitaryUI = formData => {
  const mailingAddress = formData.mailingAddress || {};
  return (
    mailingAddress['view:livesOnMilitaryBase'] ||
    isMilitaryLocation(mailingAddress.city, mailingAddress.state)
  );
};

/**
 * Update schema for country field based on military status
 * @param {object} formData - Form data
 * @param {object} schema - Current schema
 * @param {object} uiSchema - UI schema to modify
 * @returns {object} Updated schema
 */
export const updateCountrySchema = (formData, schema, uiSchema) => {
  const { COUNTRY_VALUES, COUNTRY_NAMES } = getCountryOptions();
  const countryUI = uiSchema;
  const addressFormData = formData.mailingAddress || {};
  const isMilitary = addressFormData['view:livesOnMilitaryBase'];

  if (isMilitary) {
    countryUI['ui:options'].inert = true;
    addressFormData.country = 'USA';
    return {
      enum: ['USA'],
      enumNames: ['USA'],
      default: 'USA',
    };
  }
  countryUI['ui:options'].inert = false;
  return {
    type: 'string',
    enum: COUNTRY_VALUES,
    enumNames: COUNTRY_NAMES,
  };
};

/**
 * Update schema for state field based on military status
 * @param {object} formData - Form data
 * @param {object} schema - Current schema
 * @param {object} uiSchema - UI schema to modify
 * @returns {object} Updated schema
 */
export const updateStateSchema = (formData, schema, uiSchema) => {
  const { STATE_VALUES, STATE_LABELS } = getRegularStateOptions();
  const ui = uiSchema;

  if (shouldShowMilitaryUI(formData)) {
    ui['ui:webComponentField'] = VaRadioField;
    ui['ui:errorMessages'] = {
      enum: 'Please select a military state',
    };
    return {
      enum: MILITARY_STATE_VALUES,
      enumNames: MILITARY_STATE_LABELS,
    };
  }
  ui['ui:webComponentField'] = VaSelectField;
  ui['ui:errorMessages'] = {
    required: 'Please select a state',
  };
  return {
    enum: STATE_VALUES,
    enumNames: STATE_LABELS,
  };
};

/**
 * Determine if state field is required
 * @param {object} formData - Form data
 * @returns {boolean} True if state is required
 */
export const isStateRequired = formData =>
  formData.mailingAddress?.['view:livesOnMilitaryBase'] ||
  formData.mailingAddress?.country === 'USA';

/**
 * Determine if country field is required (not military base)
 * @param {object} formData - Form data
 * @returns {boolean} True if country is required
 */
export const isCountryRequired = formData => {
  const addressData = formData.mailingAddress || {};
  return !addressData['view:livesOnMilitaryBase'];
};

/**
 * Determine if state field should be hidden
 * @param {object} formData - Form data
 * @returns {boolean} True if state should be hidden
 */
export const shouldHideState = formData =>
  !formData.mailingAddress?.['view:livesOnMilitaryBase'] &&
  formData.mailingAddress?.country !== 'USA';
