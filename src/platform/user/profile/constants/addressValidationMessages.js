import React from 'react';

export const ADDRESS_VALIDATION_TYPES = Object.freeze({
  BAD_UNIT: 'badUnitNumber',
  BAD_UNIT_OVERRIDE: 'badUnitNumberOverride',
  MISSING_UNIT: 'missingUnitNumber',
  MISSING_UNIT_OVERRIDE: 'missingUnitNumberOverride',
  SHOW_SUGGESTIONS: 'showSuggestions',
  SHOW_SUGGESTIONS_OVERRIDE: 'showSuggestionsOverride',
  VALIDATION_ERROR: 'validationError',
});

export const ADDRESS_VALIDATION_MESSAGES = Object.freeze({
  [ADDRESS_VALIDATION_TYPES.BAD_UNIT]: {
    headline: 'Please update your unit number',
    ModalText: ({ editFunction }) => (
      <p>
        We couldn’t verify your address with the U.S. Postal Service because
        there may be a problem with the unit number. Please{' '}
        <a onClick={editFunction}>edit your address</a> below to update the unit
        number.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.BAD_UNIT_OVERRIDE]: {
    headline: 'Please update or confirm your unit number',
    ModalText: ({ editFunction }) => (
      <p>
        We couldn’t verify your address with the U.S. Postal Service because
        there may be a problem with the unit number. Please{' '}
        <a onClick={editFunction}>edit your address</a> to update the unit
        number. If your unit number is already correct, please continue with the
        address you entered below.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.MISSING_UNIT]: {
    headline: 'Please add a unit number',
    ModalText: ({ editFunction }) => (
      <p>
        We couldn’t verify your address with the U.S. Postal Service because
        it’s missing a unit number. Please{' '}
        <a onClick={editFunction}>edit your address</a> below to add a unit
        number.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.MISSING_UNIT_OVERRIDE]: {
    headline: 'Please add a unit number',
    ModalText: ({ editFunction }) => (
      <p>
        It looks like your address is missing a unit number. Please{' '}
        <a onClick={editFunction}>edit your address</a> to add a unit number. If
        you don’t have a unit number and the address you entered below is
        correct, please select Continue.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS]: {
    headline: `We couldn’t verify your address`,
    ModalText: ({ editFunction }) => (
      <p>
        We’re sorry. We couldn’t verify your address with the U.S. Postal
        Service, so we won't be able to deliver your VA mail to that address.
        Please <a onClick={editFunction}>edit the address</a> you entered or
        choose a suggested address below.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_OVERRIDE]: {
    headline: 'Please confirm your address',
    ModalText: ({ editFunction }) => (
      <p>
        We couldn’t confirm your address with the U.S. Postal Service. Please
        verify your address so we can save it to your VA profile. If the address
        you entered isn’t correct, please <a onClick={editFunction}>edit it</a>{' '}
        or choose a suggested address below.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.VALIDATION_ERROR]: {
    headline: `We couldn’t verify your address`,
    ModalText: ({ editFunction }) => (
      <p>
        We’re sorry. We couldn’t verify your address with the U.S. Postal
        Service, so we will not be able to deliver your VA mail to that address.
        Please <a onClick={editFunction}>edit the address</a> you entered.
      </p>
    ),
  },
});

export const BAD_UNIT_NUMBER = 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER';
export const MISSING_UNIT_NUMBER =
  'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER';
export const CONFIRMED = 'CONFIRMED';
