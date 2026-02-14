import React from 'react';
import { ADDRESS_TYPES } from 'platform/forms/address/helpers';

export const transformPhoneNumberObject = (phone = {}) => {
  const { isInternational, areaCode, phoneNumber, countryCode } = phone;

  if (!phoneNumber || !areaCode) {
    return '';
  }

  let base = `${areaCode}${phoneNumber}`;
  if (isInternational && countryCode) {
    base = `+${countryCode} ${base}`;
  }

  return base;
};

export const transformMailingAddress = (addr = {}) => {
  const {
    addressType,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    countryCodeIso3,
    stateCode,
    internationalPostalCode,
    province,
    zipCode,
  } = addr;

  return {
    isMilitary: addressType === ADDRESS_TYPES.military,
    street: addressLine1,
    street2: addressLine2,
    street3: addressLine3,
    city,
    state: addressType === ADDRESS_TYPES.international ? province : stateCode,
    postalCode:
      addressType === ADDRESS_TYPES.international
        ? internationalPostalCode
        : zipCode,
    country: countryCodeIso3,
  };
};

export const todaysDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const today = new Date(date.getTime() - offset * 60 * 1000);
  return today.toISOString().split('T')[0];
};

export const CustomReviewTopContent = () => {
  return (
    <h3 className="vads-u-font-size--h3 vads-u-margin-top--0 vads-u-margin-bottom--3">
      Review your form
    </h3>
  );
};
