import React from 'react';

export const AddressViewField = ({ formData }) => {
  const { street, street2, city, state, postalCode } = formData;
  let postalString;
  if (postalCode) {
    const firstFive = postalCode.slice(0, 5);
    const lastChunk = postalCode.length > 5 ? `-${postalCode.slice(5)}` : '';
    postalString = `${firstFive}${lastChunk}`;
  }

  return (
    <p className="blue-bar-block">
      {street && street}
      {street && <br />}
      {street2 && street2}
      {street2 && <br />}
      {city && city} {state && state} {postalString && postalString}
    </p>
  );
};

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

export const phoneEmailViewField = ({ formData }) => {
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

export const contactInfoNote = () => (
  <span>
    <strong>Note: </strong>
    Changes you make to the information on this page will update your contact
    information for all benefits you receive from VA, including Compensation,
    Pension and Education.
  </span>
);

export const contactInfoDescription =
  'This is the contact information we have on file for you. We’ll send any important messages to this address.';
