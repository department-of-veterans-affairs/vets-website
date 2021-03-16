import {
  ADDRESS_VALIDATION_TYPES,
  BAD_UNIT_NUMBER,
  MISSING_UNIT_NUMBER,
  CONFIRMED,
} from '../constants/addressValidationMessages';

export const getValidationMessageKey = (
  suggestedAddresses,
  validationKey,
  addressValidationError,
  confirmedSuggestions,
) => {
  const singleSuggestion = suggestedAddresses.length === 1;
  const multipleSuggestions = suggestedAddresses.length > 1;
  const containsBadUnitNumber =
    suggestedAddresses.filter(
      address =>
        address.addressMetaData?.deliveryPointValidation === BAD_UNIT_NUMBER,
    ).length > 0;

  const containsMissingUnitNumber =
    suggestedAddresses.filter(
      address =>
        address.addressMetaData?.deliveryPointValidation ===
        MISSING_UNIT_NUMBER,
    ).length > 0;

  if (addressValidationError) {
    return ADDRESS_VALIDATION_TYPES.VALIDATION_ERROR;
  }

  if (singleSuggestion && containsBadUnitNumber) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.BAD_UNIT_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.BAD_UNIT;
  }

  if (singleSuggestion && containsMissingUnitNumber) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.MISSING_UNIT_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.MISSING_UNIT;
  }

  if (
    !confirmedSuggestions.length &&
    singleSuggestion &&
    !containsMissingUnitNumber &&
    !containsBadUnitNumber
  ) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_CONFIRMED;
  }

  if (
    confirmedSuggestions.length &&
    singleSuggestion &&
    !containsMissingUnitNumber &&
    !containsBadUnitNumber
  ) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS;
  }

  if (multipleSuggestions) {
    return validationKey
      ? ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_OVERRIDE
      : ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS;
  }

  return ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS; // defaulting here so the modal will show but not allow override
};

// Determines if we need to prompt the user to pick from a list of suggested
// addresses and/or edit the address that they had entered. The only time the
// address validation modal will _not_ be shown to the user is if:
// - the validation API came back with a single address suggestion
// - AND that single suggestion is either CONFIRMED or an international address
// - AND that one suggestion has a confidence score > 90
// - AND the state of the entered address matches the state of the suggestion
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

  if (
    suggestedAddresses.length === 1 &&
    firstSuggestedAddress.stateCode === userInputAddress.stateCode &&
    firstSuggestedAddressMetadata.confidenceScore > 90 &&
    (firstSuggestedAddressMetadata.deliveryPointValidation === CONFIRMED ||
      firstSuggestedAddressMetadata.addressType?.toLowerCase() ===
        'international')
  ) {
    return false;
  }

  return true;
};
