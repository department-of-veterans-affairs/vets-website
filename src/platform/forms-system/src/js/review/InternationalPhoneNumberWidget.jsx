import React from 'react';

// When coming from a PhoneNumberWidget (not review), value will be only numbers
export default function InternationalPhoneNumberWidget({ value }) {
  if (!value) {
    return <span>No phone number provided</span>;
  }

  const { callingCode, countryCode, contact } = value;
  const formattedNumber = `+${callingCode || ''} ${contact || ''}`;

  return (
    <span className="dd-privacy-hidden" data-dd-action-name="phone number">
      {formattedNumber} ({countryCode || ''})
    </span>
  );
}
