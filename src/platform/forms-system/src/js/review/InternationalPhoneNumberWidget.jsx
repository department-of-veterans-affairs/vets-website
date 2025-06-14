import React from 'react';

export default function InternationalPhoneNumberWidget({ children }) {
  const data = children?.props?.formData;
  if (data) {
    const { callingCode, contact, countryCode } = data;
    if ((callingCode, contact, countryCode)) {
      return (
        <div className="review-row">
          <dt>Contact</dt>
          <dd>{`+${callingCode} ${contact} (${countryCode})`}</dd>
        </div>
      );
    }
  }
  return <div>No phone number provided.</div>;
}
