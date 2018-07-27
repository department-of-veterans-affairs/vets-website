import React from 'react';

import AddressSection from '../../components/AddressSection';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function MailingAddress() {
  return (
    <AddressSection
      title="Mailing address"
      fieldName={FIELD_NAMES.MAILING_ADDRESS}
      deleteDisabled/>
  );
}
