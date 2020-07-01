import React from 'react';

import AddressField from './AddressField/VAPAddressField';

import { FIELD_NAMES, FIELD_TITLES } from '../constants';

export default function ResidentialAddress() {
  return (
    <AddressField
      title={FIELD_TITLES[FIELD_NAMES.RESIDENTIAL_ADDRESS]}
      fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS}
    />
  );
}
