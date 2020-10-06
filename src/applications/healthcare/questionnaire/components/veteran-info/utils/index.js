import { states50AndDC } from 'vets-json-schema/dist/constants.json';

const stateCodeToFullState = stateCode => {
  return states50AndDC.filter(f => f.value === stateCode)[0]?.label;
};

const addressToDisplay = address => {
  const addressDisplayList = [];
  if (!address) {
    return addressDisplayList;
  }

  // sa1
  if (address.addressLine1) {
    addressDisplayList.push({
      label: `Street Address 1`,
      value: address.addressLine1,
    });
  }
  // sa2
  if (address.addressLine2) {
    addressDisplayList.push({
      label: `Street Address 2`,
      value: address.addressLine2,
    });
  }
  // sa3
  if (address.addressLine3) {
    addressDisplayList.push({
      label: `Street Address 3`,
      value: address.addressLine3,
    });
  }
  // city
  if (address.city) {
    addressDisplayList.push({
      label: 'City',
      value: address.city,
    });
  }
  // stateCode
  if (address.stateCode) {
    addressDisplayList.push({
      label: 'State',
      value: stateCodeToFullState(address.stateCode),
    });
  }
  // zipCode
  if (address.zipCode) {
    addressDisplayList.push({
      label: 'Zip',
      value: address.zipCode,
    });
  }
  return addressDisplayList;
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
