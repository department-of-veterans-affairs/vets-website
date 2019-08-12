import React from 'react';

import AddressField from './AddressField';

import { FIELD_NAMES } from '../constants';

export default function ResidentialAddress() {
  return (
    <AddressField
      title="Home address"
      fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS}
    />
  );
}
