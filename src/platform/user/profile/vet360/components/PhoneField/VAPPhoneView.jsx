import React from 'react';
import PhoneNumberWidget from 'platform/forms-system/src/js/review/PhoneNumberWidget';

export default function VAPPhoneView({ data: phoneData }) {
  const phoneNumber = (
    <PhoneNumberWidget
      value={[phoneData.areaCode, phoneData.phoneNumber].join('')}
    />
  );

  const extension = phoneData.extension && <span>x{phoneData.extension}</span>;
  return (
    <div>
      {phoneNumber} {extension}
    </div>
  );
}
