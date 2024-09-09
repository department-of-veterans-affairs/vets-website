import React from 'react';
import PropTypes from 'prop-types';
import Alert from '../components/Alert';

export const CHANGE_OF_DIRECT_DEPOSIT_TITLE = 'Direct deposit information';
export const DIRECT_DEPOSIT_BUTTON_TEXT = 'Add or update account';
export const CHANGE_OF_ADDRESS_TITLE = 'Contact information';
export const ADDRESS_BUTTON_TEXT = 'Edit';
export const BAD_UNIT_NUMBER = 'STREET_NUMBER_VALIDATED_BUT_BAD_UNIT_NUMBER';
export const MISSING_UNIT_NUMBER =
  'STREET_NUMBER_VALIDATED_BUT_MISSING_UNIT_NUMBER';
export const SMALL_SCREEN = 481;

export const howToChangeLegalNameInfoLink =
  'https://www.va.gov/resources/how-to-change-your-legal-name-on-file-with-va/';

// add field title to make it a required field for the change of address form
export const addressFormRequiredData = [
  'countryCodeIso3',
  'addressLine1',
  'city',
  'stateCode',
  'zipCode',
];

export const blockURLsRegEx =
  '^((?!http|www\\.|\\.co|\\.net|\\.gov|\\.edu|\\.org).)*$';

// export const STREET_LINE_MAX_LENGTH = 20;
export const Paragraph = ({ title, date, className }) => {
  return (
    <p
      className={`vads-u-font-size--md vads-u-font-family--serif vads-u-font-weight--bold ${className}`}
    >
      {title}:
      <span className="vads-u-font-weight--normal vads-u-font-family--sans text-color vads-u-display--inline-block vads-u-margin-left--1">
        {date}
      </span>
    </p>
  );
};
Paragraph.propTypes = {
  className: PropTypes.string,
  date: PropTypes.string,
  title: PropTypes.string,
};

export const errorAddressAlert = deliveryPointValidation => {
  if (deliveryPointValidation === BAD_UNIT_NUMBER) {
    return (
      <Alert
        status="warning"
        title="Confirm your address"
        message="U.S. Postal Service records show that there may be a problem with the unit number for this address. Confirm that you want us to use this address as you entered it. Or, cancel to edit the address."
      />
    );
  }
  if (deliveryPointValidation === MISSING_UNIT_NUMBER) {
    return (
      <Alert
        status="warning"
        title="Confirm your address"
        message="U.S. Postal Service records show this address may need a unit number. Confirm that you want us to use this address as you entered it. Or, go back to edit and add a unit number."
      />
    );
  }
  if (
    deliveryPointValidation === 'MISSING_ZIP' ||
    deliveryPointValidation === 'UNDELIVERABLE'
  ) {
    return (
      <Alert
        status="warning"
        title="Confirm your address"
        message="We can’t confirm the address you entered with the U.S. Postal Service. Confirm that you want us to use this address as you entered it. Or, go back to edit it."
      />
    );
  }
  return null;
};
