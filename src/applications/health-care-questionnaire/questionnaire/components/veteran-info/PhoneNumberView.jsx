import React from 'react';
import { formatPhoneNumber } from './utils';

export default function PhoneNumberView({ number }) {
  const fullPhone = `${number.data.areaCode}${number.data.phoneNumber}`;
  if (fullPhone.length !== 10) {
    return <></>;
  }
  const phone = formatPhoneNumber(fullPhone);
  return (
    <p className="vads-u-margin--1px" data-testid="phoneNumber">
      <span data-testid={`${number.label.toLowerCase()}Phone-label`}>
        {number.label} phone:{' '}
      </span>
      <span data-testid={`${number.label.toLowerCase()}Phone`}>{phone}</span>
    </p>
  );
}
