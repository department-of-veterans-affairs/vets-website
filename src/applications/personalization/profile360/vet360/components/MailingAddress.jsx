import React from 'react';

import AddressField from './AddressField';

import {
  FIELD_NAMES
} from '../../constants/vet360';

export default function MailingAddress() {
  return (
    <AddressField
      title="Mailing address"
      fieldName={FIELD_NAMES.MAILING_ADDRESS}
      deleteDisabled/>
  );
}
