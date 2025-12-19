import React from 'react';

export const getTransformIntlPhoneNumber = (phone = {}) => {
  let _contact = '';
  const { callingCode, contact, countryCode } = phone;

  if (contact) {
    const _callingCode = callingCode ? `+${callingCode} ` : '';
    const _countryCode = countryCode ? ` (${countryCode})` : '';
    _contact = `${_callingCode}${contact}${_countryCode}`;
  }

  return _contact;
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
