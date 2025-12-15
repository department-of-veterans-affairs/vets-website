import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import isEqual from 'lodash/isEqual';

import {
  ADDRESS_VALIDATION_TYPES,
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  CONFIRMED,
} from '../constants/addressValidationMessages';

import {
  MILITARY_STATES,
  ADDRESS_TYPES_ALTERNATE,
  ADDRESS_PROPS,
  FIELD_NAMES,
} from '../constants';
import { ADDRESS_VALIDATION_SERVICE_FAILURE_CODES } from './transactions';

/**
 * An address validation object based on data from the address validation api response
 * @typedef {Object} AddressValidationObject
 * @property {Array} suggestedAddresses suggested addresses sorted by confidence score
 * @property {boolean} addressValidationError if address validation endpoint request encounted an error
 * @property {Array} confirmedSuggestions addresses that have deliveryPointValidation === CONFIRMED or international as their type. See validateAddress in transactions.js actions
 */

/**
 * Get the appropriate validation message key for ADDRESS_VALIDATION_MESSAGES
 *
 * @param {AddressValidationObject} addressValidationObject
 *
 * @returns {string} key for accessing ADDRESS_VALIDATION_MESSAGES[key]
 */
export const getValidationMessageKey = ({
  suggestedAddresses,
  addressValidationError,
  confirmedSuggestions = [],
  overrideValidationKey,
  addressValidationErrorCode,
  isNoValidationKeyAlertEnabled, // remove when profileShowNoValidationKeyAddressAlert flag is retired
}) => {
  const singleSuggestion = suggestedAddresses?.length === 1;
  const multipleSuggestions = suggestedAddresses?.length > 1;
  const containsBadUnitNumber =
    suggestedAddresses?.filter(
      address =>
        address.addressMetaData?.deliveryPointValidation === BAD_UNIT_NUMBER,
    )?.length > 0;

  const containsMissingUnitNumber =
    suggestedAddresses.filter(
      address =>
        address.addressMetaData?.deliveryPointValidation ===
        MISSING_UNIT_NUMBER,
    ).length > 0;

  if (addressValidationError) {
    if (
      ADDRESS_VALIDATION_SERVICE_FAILURE_CODES.has(addressValidationErrorCode)
    ) {
      return ADDRESS_VALIDATION_TYPES.SYSTEM_ERROR;
    }

    return ADDRESS_VALIDATION_TYPES.NO_SUGGESTIONS_NO_OVERRIDE;
  }

  if (isNoValidationKeyAlertEnabled) {
    if (!overrideValidationKey && confirmedSuggestions.length) {
      return ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_OVERRIDE;
    }

    if (!overrideValidationKey && !confirmedSuggestions.length) {
      return ADDRESS_VALIDATION_TYPES.NO_SUGGESTIONS_NO_OVERRIDE;
    }
  }

  if (singleSuggestion && containsBadUnitNumber) {
    return ADDRESS_VALIDATION_TYPES.BAD_UNIT_OVERRIDE;
  }

  if (singleSuggestion && containsMissingUnitNumber) {
    return ADDRESS_VALIDATION_TYPES.MISSING_UNIT_OVERRIDE;
  }

  if (
    !confirmedSuggestions.length &&
    singleSuggestion &&
    !containsMissingUnitNumber &&
    !containsBadUnitNumber
  ) {
    return ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE;
  }

  if (
    (confirmedSuggestions.length &&
      singleSuggestion &&
      !containsMissingUnitNumber &&
      !containsBadUnitNumber) ||
    multipleSuggestions
  ) {
    return ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_OVERRIDE;
  }

  return ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE;
};

// Determines if we need to prompt the user to pick from a list of suggested
// addresses and/or edit the address that they had entered. The only time the
// address validation modal will _not_ be shown to the user is if:
// - the validation API came back with a single address suggestion
// - AND that single suggestion is either CONFIRMED or an international address
// - AND that one suggestion has a confidence score > 90
// - AND the state of the entered address matches the state of the suggestion
// - AND the user did not use the address line 2 and line 3 fields
//
// FWIW: This sounds like a high bar to pass, but in fact most of the time this
// function will return `false` unless the user made an error entering their
// address or their address is not know to the validation API
export const showAddressValidationModal = (
  suggestedAddresses,
  userInputAddress,
) => {
  // pull the first address off of the suggestedAddresses array
  const [firstSuggestedAddress] = suggestedAddresses;
  const {
    addressMetaData: firstSuggestedAddressMetadata,
  } = firstSuggestedAddress;

  const hasValidAddress =
    !userInputAddress.addressLine2 &&
    !userInputAddress.addressLine3 &&
    suggestedAddresses.length === 1 &&
    firstSuggestedAddress.stateCode === userInputAddress.stateCode &&
    firstSuggestedAddressMetadata.confidenceScore > 90 &&
    (firstSuggestedAddressMetadata.deliveryPointValidation === CONFIRMED ||
      firstSuggestedAddressMetadata.addressType?.toLowerCase() ===
        'international');

  // if we have a valid address, we don't need to show the validation ui
  return !hasValidAddress;
};

// Infers the address type from the address supplied and returns the address
// with the "new" type.
export const inferAddressType = address => {
  let type = ADDRESS_TYPES_ALTERNATE.domestic;
  if (
    address.countryName !== 'USA' &&
    address.countryName !== 'United States'
  ) {
    type = ADDRESS_TYPES_ALTERNATE.international;
  } else if (MILITARY_STATES.has(address.stateCode)) {
    type = ADDRESS_TYPES_ALTERNATE.military;
  }

  return { ...address, type };
};

export const areAddressesEqual = (mainAddress, testAddress) => {
  const mainAddressFields = pickBy(
    pick(mainAddress, ADDRESS_PROPS),
    value => !!value,
  );
  const testAddressFields = pickBy(
    pick(testAddress, ADDRESS_PROPS),
    value => !!value,
  );

  return isEqual(mainAddressFields, testAddressFields);
};

export const validateAsciiCharacters = (errors, field) => {
  // testing specifically that the field entry only has valid ascii characters
  // eslint-disable-next-line no-control-regex
  const hasInvalidCharacters = !/^[\x00-\x7F]*$/.test(field);
  if (field && hasInvalidCharacters) {
    errors.addError(
      'Our forms can only accept the letters A to Z, numbers 0 to 9, and certain symbols like dashes and periods',
    );
  }
};

// checks for basic field data or data for nested object like gender identity
export const isFieldEmpty = (data, fieldName) => {
  // checks whether data is available and in the case of gender identity if there is a code present
  const signatureEmpty =
    fieldName === FIELD_NAMES.MESSAGING_SIGNATURE &&
    (!data?.[fieldName]?.signatureName || !data?.[fieldName]?.signatureTitle);

  return (
    !data ||
    signatureEmpty ||
    (fieldName === FIELD_NAMES.GENDER_IDENTITY && !data?.[fieldName]?.code)
  );
};
