import React from 'react';

export const ADDRESS_VALIDATION_MESSAGES = Object.freeze({
  badUnitNumber: {
    headline: 'Please update your unit number',
    modalText: editFunction => (
      <>
        We couldn’t verify your address with the U.S. Postal Service because
        there may be a problem with the unit number. Please{' '}
        <a onClick={editFunction}>edit your address</a> below to update the unit
        number.
      </>
    ),
  },
  badUnitNumberOverride: {
    headline: 'Please update or confirm your unit number',
    modalText: editFunction => (
      <>
        We couldn’t verify your address with the U.S. Postal Service because
        there may be a problem with the unit number. Please{' '}
        <a onClick={editFunction}>edit your address</a> to update the unit
        number. If your unit number is already correct, please continue with the
        address you entered below.
      </>
    ),
  },
  missingUnitNumber: {
    headline: 'Please add a unit number',
    modalText: editFunction => (
      <>
        We couldn’t verify your address with the U.S. Postal Service because
        it’s missing a unit number. Please{' '}
        <a onClick={editFunction}>edit your address</a> below to add a unit
        number.
      </>
    ),
  },
  missingUnitNumberOverride: {
    headline: 'Please add a unit number',
    modalText: editFunction => (
      <>
        It looks like your address is missing a unit number. Please{' '}
        <a onClick={editFunction}>edit your address</a> to add a unit number. If
        you don’t have a unit number and the address you entered below is
        correct, please select Continue.
      </>
    ),
  },
  showSuggestions: {
    headline: `We couldn’t verify your address`,
    modalText: editFunction => (
      <>
        We’re sorry. We couldn’t verify your address with the U.S. Postal
        Service, so we won't be able to deliver your VA mail to that address.
        Please <a onClick={editFunction}>edit the address</a> you entered or
        choose a suggested address below.
      </>
    ),
  },
  showSuggestionsOverride: {
    headline: 'Please confirm your address',
    modalText: editFunction => (
      <>
        We couldn’t confirm your address with the U.S. Postal Service. Please
        verify your address so we can save it to your VA profile. If the address
        you entered isn’t correct, please <a onClick={editFunction}>edit it</a>{' '}
        or choose a suggested address below.
      </>
    ),
  },
  validationError: {
    headline: `We couldn’t verify your address`,
    modalText: editFunction => (
      <>
        We’re sorry. We couldn’t verify your address with the U.S. Postal
        Service, so we will not be able to deliver your VA mail to that address.
        Please <a onClick={editFunction}>edit the address</a> you entered.
      </>
    ),
  },
});

export const BAD_UNIT_NUMBER = 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER';
export const MISSING_UNIT_NUMBER =
  'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER';
export const CONFIRMED = 'CONFIRMED';
