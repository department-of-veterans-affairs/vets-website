export const ADDRESS_VALIDATION_MESSAGES = Object.freeze({
  badUnitNumber: {
    headline: 'Please update your unit number',
    modalText: `We couldn’t verify your address with the U.S. Postal Service because there may be a problem with the unit number. Please edit your address below to update the unit number.`,
  },
  badUnitNumberOverride: {
    headline: 'Please update or confirm your unit number',
    modalText: `We couldn’t verify your address with the U.S. Postal Service because there may be a problem with the unit number. Please edit your address to update the unit number. If your unit number is already correct, please continue with the address you entered below.`,
  },
  missingUnitNumber: {
    headline: 'Please add a unit number',
    modalText: `We couldn’t verify your address with the U.S. Postal Service because it’s missing a unit number. Please edit your address below to add a unit number.`,
  },
  missingUnitNumberOverride: {
    headline: 'Please add a unit number',
    modalText: `It looks like your address is missing a unit number. Please edit your address to add a unit number. If you don’t have a unit number and the address you entered below is correct, please select Continue`,
  },
  showSuggestions: {
    headline: `We couldn’t verify your address`,
    modalText: `We’re sorry.  We couldn’t verify your address with the U.S. Postal Service, so we won't be able to deliver your VA mail to that address.  Please edit the address you entered or choose a suggested address below.`,
  },
  showSuggestionsOverride: {
    headline: 'Please confirm your address',
    modalText: `We couldn’t confirm your address with the U.S. Postal Service.  Please verify your address so we can save it to your VA profile.  If the address you entered isn’t correct, please edit it or choose a suggested address below`,
  },
  validationError: {
    headline: `We couldn’t verify your address`,
    modalText: `We’re sorry.  We couldn’t verify your address with the U.S. Postal Service, so we will not be able to deliver your VA mail to that address.  Please edit the address you entered.`,
  },
});

export const BAD_UNIT_NUMBER = 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER';
export const MISSING_UNIT_NUMBER =
  'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER';
