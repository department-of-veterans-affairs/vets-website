/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

export const ADDRESS_VALIDATION_TYPES = Object.freeze({
  BAD_UNIT_OVERRIDE: 'badUnitNumberOverride',
  MISSING_UNIT_OVERRIDE: 'missingUnitNumberOverride',
  SHOW_SUGGESTIONS_OVERRIDE: 'showSuggestionsOverride',
  SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE: 'showSuggestionsNoConfirmedOverride',
  NO_SUGGESTIONS_NO_OVERRIDE: 'noSuggestionsNoOverride',
  SHOW_SUGGESTIONS_NO_OVERRIDE: 'showSuggestionsNoOverride',
  VALIDATION_ERROR: 'validationError',
});

const headline = 'Confirm your address';

export const BAD_UNIT_NUMBER = 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER';
export const MISSING_UNIT_NUMBER =
  'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER';
export const CONFIRMED = 'CONFIRMED';

// just used for one address validation type/case
// a validation error is a special case of a validation warning in that is still includes the edit button
const ValidationErrorText = ({ editFunction }) => (
  <p>
    We’re sorry. We couldn’t verify your address with the U.S. Postal Service,
    so we will not be able to deliver your VA mail to that address. Please{' '}
    <va-button
      class="va-button-link"
      onClick={editFunction}
      text="edit the address"
    />{' '}
    you entered.
  </p>
);

ValidationErrorText.propTypes = {
  editFunction: PropTypes.func.isRequired,
};

export const ADDRESS_VALIDATION_MESSAGES = Object.freeze({
  [ADDRESS_VALIDATION_TYPES.BAD_UNIT_OVERRIDE]: {
    headline,
    ModalText: () => (
      <p>
        U.S. Postal Service records show that there may be a problem with the
        unit number for this address. Confirm that you want us to use this
        address as you entered it. Or, cancel to edit the address.
      </p>
    ),
  },

  [ADDRESS_VALIDATION_TYPES.MISSING_UNIT_OVERRIDE]: {
    headline,
    ModalText: () => (
      <p>
        U.S. Postal Service records show this address may need a unit number.
        Confirm that you want us to use this address as you entered it. Or, go
        back to edit and add a unit number.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_OVERRIDE]: {
    headline:
      'We can’t confirm the address you entered with the U.S. Postal Service.',
    ModalText: () => (
      <p>Tell us which of these addresses you’d like us to use.</p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_CONFIRMED_OVERRIDE]: {
    headline,
    ModalText: () => (
      <p>
        We can’t confirm the address you entered with the U.S. Postal Service.
        Confirm that you want us to use this address as you entered it. Or, go
        back to edit it.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.NO_SUGGESTIONS_NO_OVERRIDE]: {
    headline: 'This address you entered is invalid',
    ModalText: () => (
      <p>
        We can’t confirm the address you entered with the U.S. Postal Service.
        You’ll need to go back to edit it.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.SHOW_SUGGESTIONS_NO_OVERRIDE]: {
    headline:
      'We can’t confirm the address you entered with the U.S. Postal Service',
    ModalText: () => (
      <p>
        We can use the suggested address we found. Or, you can go back to edit
        the address you entered.
      </p>
    ),
  },
  [ADDRESS_VALIDATION_TYPES.VALIDATION_ERROR]: {
    headline: `We couldn’t verify your address`,
    ModalText: ValidationErrorText,
  },
});
