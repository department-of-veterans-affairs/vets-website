import React from 'react';

const PhoneViewField = ({ formData: phoneNumber = '', name }) => {
  const midBreakpoint = -7;
  const lastPhoneString = phoneNumber.slice(-4);
  const middlePhoneString = phoneNumber.slice(midBreakpoint, -4);
  const firstPhoneString = phoneNumber.slice(0, midBreakpoint);

  const phoneString = `${firstPhoneString}-${middlePhoneString}-${lastPhoneString}`;
  return (
    <p>
      <strong>{name}</strong>: {phoneString}
    </p>
  );
};

export const PhoneEmailViewField = ({ formData }) => {
  const { inputVeteranPrimaryPhone, emailAddress } = formData;
  return (
    <div>
      <PhoneViewField
        formData={inputVeteranPrimaryPhone}
        name="Primary phone"
      />
      <p>
        <strong>Email address</strong>: {emailAddress || ''}
      </p>
    </div>
  );
};
