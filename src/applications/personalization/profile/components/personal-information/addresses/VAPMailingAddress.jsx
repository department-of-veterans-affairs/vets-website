import React from 'react';

import AddressField from './VAPAddressField';

import { FIELD_NAMES, FIELD_TITLES } from '@@vet360/constants';

export default function MailingAddress() {
  return (
    <AddressField
      title={FIELD_TITLES[FIELD_NAMES.MAILING_ADDRESS]}
      fieldName={FIELD_NAMES.MAILING_ADDRESS}
      deleteDisabled
    />
  );
}
