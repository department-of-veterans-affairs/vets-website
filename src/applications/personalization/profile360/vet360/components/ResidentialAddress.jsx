import React from 'react';

import AddressSection from '../../components/AddressSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function ResidentialAddress() {
  return (
    <AddressSection
      title="Home address"
      fieldName={FIELD_NAMES.RESIDENTIAL_ADDRESS}
      analyticsSectionName="home-address"/>
  );
}
