export const getTransformIntlPhoneNumber = (phone = {}) => {
  let _contact = '';
  const { callingCode, contact, countryCode } = phone;

  if (contact) {
    const _callingCode = callingCode ? `+${callingCode} ` : '';
    const _countryCode = countryCode ? ` (${countryCode})` : '';
    _contact = `${_callingCode}${contact}${_countryCode}`;
  }

  return _contact;
};
