import React from 'react';

export default function InternationalPhoneNumberWidget({ children }) {
  const data = children?.props?.formData;
  let _contact = 'No contact provided';
  if (data) {
    const { callingCode, contact, countryCode } = data;
    if ((callingCode, contact, countryCode)) {
      _contact = `+${callingCode} ${contact} (${countryCode})`;
    }
  }

  return (
    <div className="review-row">
      <dt>Contact</dt>
      <dd>{_contact}</dd>
    </div>
  );
}
