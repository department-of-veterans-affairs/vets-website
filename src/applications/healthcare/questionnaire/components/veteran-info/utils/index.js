import React from 'react';
import { states50AndDC } from 'vets-json-schema/dist/constants.json';
import AddressView from '../AddressView';

const stateCodeToFullState = stateCode => {
  return states50AndDC.filter(f => f.value === stateCode)[0]?.label;
};

const addressToDisplay = (label, address) => {
  if (!address) {
    return { label };
  }
  return {
    label,
    value: <AddressView address={address} />,
  };
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
