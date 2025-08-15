import React from 'react';

export default function InternationalPhoneNumberWidget({ children }) {
  const data = children?.props?.formData;
  const { callingCode, contact, countryCode } = data;
  let _contact = 'No contact provided';
  if (contact) {
    const _callingCode = callingCode ? `+${callingCode} ` : '';
    const _countryCode = countryCode ? ` (${countryCode})` : '';
    _contact = `${_callingCode}${contact}${_countryCode}`;
  }
  const label = children?.props?.uiSchema?.['ui:title'] || 'Contact';
  return (
    <div className="review-row">
      <dt>{label}</dt>
      <dd>{_contact}</dd>
    </div>
  );
}
