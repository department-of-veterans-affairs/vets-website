import React from 'react';
import PhoneNumberWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

export default function PhoneView({ data: phoneData }) {
  const phoneNumber = (
    <PhoneNumberWidget
      value={[phoneData.areaCode, phoneData.phoneNumber].join('')}
    />
  );
  const countryCode = phoneData.countryCode && (
    <span>+ {phoneData.countryCode}</span>
  );
  const extension = phoneData.extension && <span>x{phoneData.extension}</span>;
  return (
    <div>
      {countryCode} {phoneNumber} {extension}
    </div>
  );
}
