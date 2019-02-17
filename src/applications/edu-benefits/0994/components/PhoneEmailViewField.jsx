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
  const { dayTimePhone, nightTimePhone, emailAddress } = formData;
  return (
    <div>
      <PhoneViewField formData={dayTimePhone} name="Phone number" />
      <PhoneViewField
        formData={nightTimePhone}
        name="Alternative Phone number"
      />
      <p>
        <strong>Email address</strong>: {emailAddress || ''}
      </p>
    </div>
  );
};
