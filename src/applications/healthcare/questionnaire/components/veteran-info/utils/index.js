import { states50AndDC } from 'vets-json-schema/dist/constants.json';

const stateCodeToFullState = stateCode => {
  return states50AndDC.filter(f => f.value === stateCode)[0]?.label;
};

const addressToDisplay = address => {
  const rv = [];
  if (!address) {
    return rv;
  }

  // sa1
  if (address.addressLine1) {
    rv.push({
      label: `Address 1`,
      value: address.addressLine1,
    });
  }
  // sa2
  if (address.addressLine2) {
    rv.push({
      label: `Address 2`,
      value: address.addressLine2,
    });
  }
  // sa3
  if (address.addressLine3) {
    rv.push({
      label: `Address 3`,
      value: address.addressLine3,
    });
  }
  // city
  if (address.city) {
    rv.push({
      label: 'City',
      value: address.city,
    });
  }
  // stateCode
  if (address.stateCode) {
    rv.push({
      label: 'State',
      value: stateCodeToFullState(address.stateCode),
    });
  }
  // zipCode
  if (address.zipCode) {
    rv.push({
      label: 'Zip',
      value: address.zipCode,
    });
  }
  return rv;
};

const formatPhoneNumber = phoneNumberString => {
  const cleaned = `${phoneNumberString}`.replace(/\D/g, '');
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? '+1 ' : '';
    return [intlCode, '', match[2], '-', match[3], '-', match[4]].join('');
  }
  return null;
};

export { addressToDisplay, formatPhoneNumber, stateCodeToFullState };
